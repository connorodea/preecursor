# Preecursor: initial acquisition workflow

Start with **US distributors and logistics/service operations with 10–200 staff**
that process repetitive RFQs, quote requests, order entry or status updates across
email and spreadsheets. This is an initial segment hypothesis aligned with the
founder's operational software experience, not evidence of validated demand.

Offer: a 30-minute workflow discovery call to identify one measurable automation
opportunity. Collect baseline volume, minutes per task, error/rework rate, systems,
and who owns implementation. Propose a tightly scoped paid pilot only after fit
and data-access review. Do not promise fixed savings or autonomous deployment.

## First two weeks

1. Manually identify 25 companies from their own websites, industry directories
   that permit this use, existing relationships and partner introductions. Record
   source URL, relevant workflow signal, jurisdiction and a short fit rationale.
   Prefer businesses with an identifiable owner of operations and accessible
   systems. Do not buy lists, scrape prohibited sources or collect sensitive data.
2. Review each account against the rubric below. Choose ten credible opportunities.
   Use existing relationships and permission-based introductions first. Prepare
   tailored outreach drafts for human review; no automatic cold sequence exists.
3. Publish a concrete workflow example and discovery CTA through channels the
   owner authorizes. Route referrals and opt-in responses to `/contact/` using
   non-personal campaign tags. Keep each message specific to one observed workflow.
4. Review new inquiries each business day. Verify the business, process owner,
   volume, budget and realistic start date. Approve responses individually.
5. Invite interested buyers to the configured discovery event. Calendly manages
   availability, reminders and calendar invitations after the visitor books.
   Signed webhooks record actual bookings and cancellations.
6. After each call, record completed or no-show, baseline economics, objections,
   next action and owner. Use what you learn to narrow the segment and offer.

CSV contract for the private importer:

```text
name,email,company,source_url,fit_evidence,jurisdiction
```

Use real evidence in a private file. Importing only creates an `identified` record.
A publicly listed email is not consent. Permission must be documented before this
service drafts a follow-up, and every message still requires explicit approval.
If considering unsolicited outreach, separately review jurisdiction, provider
restrictions and the exact recipients/channel/message before any sending.

## Qualification rubric

| Check | Evidence to collect | Decision |
| --- | --- | --- |
| Workflow | Repetitive process with defined inputs and output | Reject vague interest without a concrete task |
| Volume | Transactions/week and time/transaction | Quantify baseline workload |
| Authority | Named process owner and decision-maker | Confirm access to a sponsor |
| Budget | Funds or a realistic pilot budget discussion | Quote scope after discovery |
| Timing | Start window and operational availability | Distinguish active demand from research |
| Success metric | Measurable time, error or response-time improvement | Agree how the pilot will be evaluated |

Self-reported website budget/timing score ranks review only. A named operator
records the six evidence fields with `qualify`. Avoid uploading customer documents,
credentials or regulated data to the sales pipeline.

## Funnel definitions and instrumentation

| Milestone | Authoritative evidence | Metric |
| --- | --- | --- |
| Identified | Imported source URL and fit evidence | Unique researched contacts/accounts |
| Permission recorded | Operator evidence or inquiry consent | Permission-bearing contacts |
| Captured | Committed form transaction | Unique contacts with inquiry; submissions counted separately |
| Qualified | Six-field operator review | Qualified contacts / reviewed contacts (review count recorded operationally) |
| Outreach sent | Confirmed provider send ID | Unique contacted prospects/inquiries |
| Replied | Signed inbound event or verified operator entry | Responding contacts / contacted contacts |
| Booking link opened | Signed-token redirect | Diagnostic only; scanners may open links |
| Booked | Verified Calendly event, or reconciled signed event | Qualified contacts that booked / qualified contacts |
| Completed | Operator confirms attendance after end time | Completed contacts / booked contacts |
| No-show/canceled | Operator outcome / provider cancellation | Separate operational follow-up queues |

`report` uses unique contacts with historical milestones, so canceling a booking
cannot erase the fact that a booking happened. Current state is separate. Website
and prospect cohorts are reported separately. Conversion numerators are set
intersections with their denominator cohort, not unrelated event-count division.
Multiple meetings for one contact do not inflate unique-contact conversion. This
first version does not attribute revenue, run paid ads or claim collected MRR.

Campaign convention (non-personal tags only):

```text
https://preecursor.com/contact/?utm_source=partner&utm_medium=referral&utm_campaign=distribution_pilot_2026q4
https://preecursor.com/contact/?utm_source=linkedin&utm_medium=organic&utm_campaign=rfq_workflow_2026q4
```

UTMs persist for the browser session and are stored with inquiries. Optional GA4
requires visitor opt-in; the private inquiry-to-call funnel does not require GA4.

## Initial operating targets, not forecasts

For the first two weeks: 25 researched accounts, ten with documented fit, five
permission-based conversations, three booked calls, two completed calls. Track
actuals weekly and adjust from evidence. These are working goals, not benchmarks
or a promise of $100k/month. Revenue planning needs observed sales-cycle length,
proposal conversion, implementation capacity and retention data first.

One owner reviews the queue daily, approves messages, handles objections/replies,
checks suppression, and records call outcomes. Stop scaling acquisition if delivery
capacity or follow-up quality deteriorates. The first milestone is one verified
end-to-end path from an authorized inquiry to an attended discovery call.
