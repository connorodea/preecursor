"""Run from the repository root: python -m services.acquisition.cli --help."""
import argparse
import csv
import json
import os
import sqlite3
from pathlib import Path
from .config import Config
from .core import Store, Problem, email_address
from .providers import Providers
from .worker import tick


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    for name in ('init', 'report', 'queue', 'contacts', 'bookings', 'tick', 'retry-crm'):
        sub.add_parser(name)
    p = sub.add_parser('approve'); p.add_argument('draft_id'); p.add_argument('--actor', required=True)
    p = sub.add_parser('edit-draft'); p.add_argument('draft_id'); p.add_argument('--subject', required=True); p.add_argument('--body-file', required=True)
    p = sub.add_parser('qualify'); p.add_argument('contact_id'); p.add_argument('--evidence-file', required=True); p.add_argument('--actor', required=True)
    p = sub.add_parser('reply'); p.add_argument('contact_id'); p.add_argument('--actor', required=True)
    p = sub.add_parser('meeting'); p.add_argument('invitee_uri'); p.add_argument('--outcome', choices=('completed', 'no_show'), required=True); p.add_argument('--actor', required=True)
    p = sub.add_parser('reconcile-booking'); p.add_argument('invitee_uri'); p.add_argument('contact_id'); p.add_argument('--actor', required=True); p.add_argument('--evidence', required=True)
    p = sub.add_parser('import-prospects'); p.add_argument('csv_file'); p.add_argument('--actor', required=True)
    p = sub.add_parser('permission'); p.add_argument('contact_id'); p.add_argument('--evidence', required=True); p.add_argument('--actor', required=True)
    p = sub.add_parser('suppress'); p.add_argument('email'); p.add_argument('--reason', required=True)
    p = sub.add_parser('backup'); p.add_argument('destination')
    args = parser.parse_args()
    os.umask(0o077)
    store = Store(Config.from_env())
    result = {'ok': True}
    try:
        if args.command == 'init':
            store.initialize()
        elif args.command == 'report':
            result = store.report()
        elif args.command in ('queue', 'contacts', 'bookings'):
            table = {'queue': 'drafts', 'contacts': 'contacts', 'bookings': 'bookings'}[args.command]
            with store.transaction() as db:
                result = [dict(row) for row in db.execute(f'SELECT * FROM {table}').fetchall()]
        elif args.command == 'tick':
            result = tick(store, Providers(store.config))
        elif args.command == 'approve':
            store.approve(args.draft_id, args.actor)
        elif args.command == 'edit-draft':
            store.edit_draft(args.draft_id, args.subject, Path(args.body_file).read_text())
        elif args.command == 'qualify':
            store.qualify(args.contact_id, json.loads(Path(args.evidence_file).read_text()), args.actor)
        elif args.command == 'reply':
            store.mark_reply(args.contact_id, args.actor)
        elif args.command == 'meeting':
            store.complete_booking(args.invitee_uri, args.outcome, args.actor)
        elif args.command == 'reconcile-booking':
            store.reconcile_booking(args.invitee_uri, args.contact_id, args.actor, args.evidence)
        elif args.command == 'permission':
            store.grant_permission(args.contact_id, args.evidence, args.actor)
        elif args.command == 'import-prospects':
            with open(args.csv_file, newline='') as source:
                result = [store.import_prospect(row, args.actor) for row in csv.DictReader(source)]
        elif args.command == 'suppress':
            with store.transaction() as db:
                store.suppress(db, email_address(args.email), args.reason[:300])
        elif args.command == 'retry-crm':
            with store.transaction() as db:
                db.execute("UPDATE crm_jobs SET status='pending',attempts=0,due_at=?,error=NULL WHERE status='failed'", (store.now(),))
        elif args.command == 'backup':
            destination = Path(args.destination)
            if destination.exists():
                raise Problem(409, 'Backup destination already exists')
            source = store.connect()
            backup = sqlite3.connect(destination)
            try:
                source.backup(backup)
            finally:
                source.close(); backup.close()
            os.chmod(destination, 0o600)
    except (Problem, ValueError, OSError) as error:
        parser.exit(1, str(error) + '\n')
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
