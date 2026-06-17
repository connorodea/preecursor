import { describe, it, expect } from "vitest";
import {
  ABOUT,
  LEADERSHIP,
  CAREERS,
  peopleByGroup,
  rolesByTeam,
  type PersonGroup,
  type OpenRole,
} from "./company";

/* ------------------------------------------------------------------ ABOUT -- */

describe("ABOUT content", () => {
  it("has non-empty hero copy", () => {
    expect(ABOUT.hero.title.length).toBeGreaterThan(0);
    expect(ABOUT.hero.lede.length).toBeGreaterThan(0);
  });

  it("has a non-empty story with non-empty paragraphs", () => {
    expect(ABOUT.story.length).toBeGreaterThan(0);
    for (const p of ABOUT.story) {
      expect(p.length).toBeGreaterThan(0);
    }
  });

  it("has values, each with a title and desc", () => {
    expect(ABOUT.values.length).toBeGreaterThan(0);
    for (const v of ABOUT.values) {
      expect(v.title.length).toBeGreaterThan(0);
      expect(v.desc.length).toBeGreaterThan(0);
    }
  });

  it("has the three howWeWork principles, each with a title and desc", () => {
    expect(ABOUT.howWeWork).toHaveLength(3);
    for (const p of ABOUT.howWeWork) {
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.desc.length).toBeGreaterThan(0);
    }
  });

  it("has partnerships body + rows, each with a title and desc", () => {
    expect(ABOUT.partnerships.body.length).toBeGreaterThan(0);
    expect(ABOUT.partnerships.rows.length).toBeGreaterThan(0);
    for (const r of ABOUT.partnerships.rows) {
      expect(r.title.length).toBeGreaterThan(0);
      expect(r.desc.length).toBeGreaterThan(0);
    }
  });

  it("has a non-empty press body", () => {
    expect(ABOUT.press.body.length).toBeGreaterThan(0);
  });
});

/* ------------------------------------------------------------- LEADERSHIP -- */

describe("LEADERSHIP content", () => {
  it("has non-empty hero copy", () => {
    expect(LEADERSHIP.hero.title.length).toBeGreaterThan(0);
    expect(LEADERSHIP.hero.lede.length).toBeGreaterThan(0);
  });

  it("declares the four groups with label + blurb", () => {
    expect(LEADERSHIP.groups).toHaveLength(4);
    const groups = LEADERSHIP.groups.map((g) => g.group);
    expect(new Set(groups)).toEqual(
      new Set<PersonGroup>(["Partner", "Advisor", "Operator", "Researcher"])
    );
    for (const g of LEADERSHIP.groups) {
      expect(g.label.length).toBeGreaterThan(0);
      expect(g.blurb.length).toBeGreaterThan(0);
    }
  });

  it("has people, each with required non-empty fields and a valid group", () => {
    expect(LEADERSHIP.people.length).toBeGreaterThan(0);
    const validGroups = new Set(LEADERSHIP.groups.map((g) => g.group));
    for (const p of LEADERSHIP.people) {
      expect(p.name.length, p.name).toBeGreaterThan(0);
      expect(p.role.length, p.name).toBeGreaterThan(0);
      expect(p.bio.length, p.name).toBeGreaterThan(0);
      expect(p.seed.length, p.name).toBeGreaterThan(0);
      expect(validGroups.has(p.group), p.name).toBe(true);
    }
  });

  it("has a unique avatar seed per person", () => {
    const seeds = LEADERSHIP.people.map((p) => p.seed);
    expect(new Set(seeds).size).toBe(seeds.length);
  });

  it("carries no false company-affiliation logos", () => {
    // The fabricated "prior-affiliation" logo row was removed: we don't imply
    // the team came from companies we haven't verifiably worked at.
    expect("logos" in LEADERSHIP).toBe(false);
    const blob = JSON.stringify(LEADERSHIP);
    for (const name of ["OpenAI", "DeepMind", "McKinsey", "Stripe", "Google", "Palantir"]) {
      expect(blob, name).not.toContain(name);
    }
  });

  it("never references off-limits brand names", () => {
    const blob = JSON.stringify(LEADERSHIP).toLowerCase();
    expect(blob).not.toContain("techliquidators");
  });
});

describe("peopleByGroup", () => {
  it("returns only people in the requested group, preserving declared order", () => {
    for (const { group } of LEADERSHIP.groups) {
      const result = peopleByGroup(group);
      expect(result.every((p) => p.group === group), group).toBe(true);
      // declared order is preserved (filter is stable)
      const expected = LEADERSHIP.people.filter((p) => p.group === group);
      expect(result).toEqual(expected);
    }
  });

  it("partitions all people across the four groups with no leftovers", () => {
    const total = LEADERSHIP.groups.reduce(
      (sum, g) => sum + peopleByGroup(g.group).length,
      0
    );
    expect(total).toBe(LEADERSHIP.people.length);
  });

  it("returns an empty array for a group with no people", () => {
    // Cast to exercise the no-match branch with an off-list group value.
    expect(peopleByGroup("Nonexistent" as PersonGroup)).toEqual([]);
  });
});

/* ---------------------------------------------------------------- CAREERS -- */

describe("CAREERS content", () => {
  it("has non-empty hero copy and intro", () => {
    expect(CAREERS.hero.title.length).toBeGreaterThan(0);
    expect(CAREERS.hero.lede.length).toBeGreaterThan(0);
    expect(CAREERS.intro.length).toBeGreaterThan(0);
  });

  it("has open roles, each with required non-empty fields and a valid team", () => {
    expect(CAREERS.openRoles.length).toBeGreaterThan(0);
    const validTeams = new Set(CAREERS.teams.map((t) => t.team));
    for (const r of CAREERS.openRoles) {
      expect(r.title.length, r.title).toBeGreaterThan(0);
      expect(r.location.length, r.title).toBeGreaterThan(0);
      expect(r.type.length, r.title).toBeGreaterThan(0);
      expect(validTeams.has(r.team), r.title).toBe(true);
    }
  });

  it("declares team blurbs covering every team an open role uses", () => {
    expect(CAREERS.teams.length).toBeGreaterThan(0);
    for (const t of CAREERS.teams) {
      expect(t.label.length).toBeGreaterThan(0);
      expect(t.blurb.length).toBeGreaterThan(0);
    }
    const roleTeams = new Set(CAREERS.openRoles.map((r) => r.team));
    const blurbTeams = new Set(CAREERS.teams.map((t) => t.team));
    for (const team of roleTeams) {
      expect(blurbTeams.has(team), team).toBe(true);
    }
  });

  it("has a non-empty life body and perks", () => {
    expect(CAREERS.life.body.length).toBeGreaterThan(0);
    for (const p of CAREERS.life.body) {
      expect(p.length).toBeGreaterThan(0);
    }
    expect(CAREERS.life.perks.length).toBeGreaterThan(0);
    for (const perk of CAREERS.life.perks) {
      expect(perk.title.length).toBeGreaterThan(0);
      expect(perk.desc.length).toBeGreaterThan(0);
    }
  });
});

describe("rolesByTeam", () => {
  it("returns only roles in the requested team, preserving declared order", () => {
    for (const { team } of CAREERS.teams) {
      const result = rolesByTeam(team);
      expect(result.every((r) => r.team === team), team).toBe(true);
      const expected = CAREERS.openRoles.filter((r) => r.team === team);
      expect(result).toEqual(expected);
    }
  });

  it("partitions all open roles across the declared teams with no leftovers", () => {
    const total = CAREERS.teams.reduce(
      (sum, t) => sum + rolesByTeam(t.team).length,
      0
    );
    expect(total).toBe(CAREERS.openRoles.length);
  });

  it("returns an empty array for a team with no open roles", () => {
    expect(rolesByTeam("Nonexistent" as OpenRole["team"])).toEqual([]);
  });
});
