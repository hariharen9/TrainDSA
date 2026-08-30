export type BehavioralCategory =
  | 'Leadership & Ownership'
  | 'Conflict & Collaboration'
  | 'Failure & Learning'
  | 'Technical Decision-Making'
  | 'Ambiguity & Initiative'

export type BehavioralStatus = 'not_prepared' | 'drafted' | 'ready'

export type BehavioralQuestion = {
  id: string
  category: BehavioralCategory
  question: string
  interviewerLooksFor: string
  powerPhrases: string[]
  followUps: string[]
}

export const BEHAVIORAL_QUESTIONS: BehavioralQuestion[] = [
  // Leadership & Ownership
  {
    id: 'beh-01',
    category: 'Leadership & Ownership',
    question: "Tell me about a time you took ownership of a project or problem that wasn't strictly your responsibility.",
    interviewerLooksFor: 'Proactiveness, accountability, willingness to go beyond job scope, driving outcomes without authority.',
    powerPhrases: ['I noticed a gap and stepped in', 'drove it to completion', 'took full accountability'],
    followUps: ["What would have happened if you hadn't?", 'How did others react?'],
  },
  {
    id: 'beh-02',
    category: 'Leadership & Ownership',
    question: 'Describe a time you had to lead a project without formal authority.',
    interviewerLooksFor: 'Influencing skills, stakeholder management, ability to align cross-functional teams without direct power.',
    powerPhrases: ['built consensus', 'aligned stakeholders', 'influenced without authority'],
    followUps: ['Who pushed back most?', 'What would you do differently?'],
  },
  {
    id: 'beh-03',
    category: 'Leadership & Ownership',
    question: 'Tell me about a time you set a high bar for quality on your team.',
    interviewerLooksFor: 'Standards-setting behavior, attention to craft, raising the team vs. personal performance.',
    powerPhrases: ['raised the bar', 'set a standard', 'code review culture', 'not willing to ship until'],
    followUps: ['Did others follow? How long did it take?'],
  },
  {
    id: 'beh-04',
    category: 'Leadership & Ownership',
    question: 'Give me an example of when you delivered results under a very tight deadline.',
    interviewerLooksFor: 'Prioritization, focus under pressure, pragmatic trade-offs, and delivery mindset.',
    powerPhrases: ['triaged ruthlessly', 'cut scope intelligently', 'shipped on time', 'kept the team calm'],
    followUps: ['What did you cut? Any regrets?', 'How did you communicate the constraints upward?'],
  },
  {
    id: 'beh-05',
    category: 'Leadership & Ownership',
    question: 'Tell me about a time you mentored or helped grow another engineer.',
    interviewerLooksFor: 'Investing in others, knowledge transfer, scaling yourself through the team.',
    powerPhrases: ['pair programming', 'structured 1:1s', 'saw a blind spot and addressed it'],
    followUps: ['How did they grow? Are you still in touch?'],
  },
  {
    id: 'beh-06',
    category: 'Leadership & Ownership',
    question: 'Tell me about a time you had to make a difficult decision with limited information.',
    interviewerLooksFor: 'Bias for action, comfort with ambiguity, decision framework, reversibility thinking.',
    powerPhrases: ['two-way door decision', 'made the call with the data I had', 'set a checkpoint to revisit'],
    followUps: ['How did it turn out? What would you change?'],
  },
  // Conflict & Collaboration
  {
    id: 'beh-07',
    category: 'Conflict & Collaboration',
    question: 'Tell me about a time you disagreed with your manager or senior leadership.',
    interviewerLooksFor: 'Ability to disagree respectfully, data-driven arguments, willingness to commit even after losing the debate.',
    powerPhrases: ['disagree and commit', 'presented data to support my view', 'respected the final call'],
    followUps: ['What happened? Were you right?', 'Would you do the same again?'],
  },
  {
    id: 'beh-08',
    category: 'Conflict & Collaboration',
    question: 'Describe a conflict you had with a teammate and how you resolved it.',
    interviewerLooksFor: 'Emotional intelligence, direct communication, seeking mutual understanding, not avoiding conflict.',
    powerPhrases: ['had a direct conversation', 'focused on the problem not the person', 'found common ground'],
    followUps: ['What was the root cause? Is the relationship better now?'],
  },
  {
    id: 'beh-09',
    category: 'Conflict & Collaboration',
    question: 'Tell me about a time you worked with a difficult or underperforming teammate.',
    interviewerLooksFor: 'Empathy, structured feedback, ability to help without enabling, escalation as a last resort.',
    powerPhrases: ['gave specific feedback', 'tried to understand their constraints', 'escalated only after trying informally'],
    followUps: ['Did they improve? What happened ultimately?'],
  },
  {
    id: 'beh-10',
    category: 'Conflict & Collaboration',
    question: 'Tell me about a successful cross-functional collaboration you led or participated in.',
    interviewerLooksFor: 'Cross-team communication, shared goals vs. team silos, relationship building.',
    powerPhrases: ['aligned on shared outcomes', 'bridged the gap between design and engineering', 'regular syncs'],
    followUps: ['What made it work? What was the hardest part?'],
  },
  {
    id: 'beh-11',
    category: 'Conflict & Collaboration',
    question: 'Describe a time when you had to influence a decision without having all the data.',
    interviewerLooksFor: 'Persuasion, storytelling, leading with insight when data is incomplete.',
    powerPhrases: ['used analogies', 'showed patterns from adjacent cases', 'structured the argument clearly'],
    followUps: ['Did it work? How did you validate later?'],
  },
  // Failure & Learning
  {
    id: 'beh-12',
    category: 'Failure & Learning',
    question: 'Tell me about your biggest professional failure or mistake.',
    interviewerLooksFor: 'Self-awareness, honesty, concrete learnings, what systems/process changes followed.',
    powerPhrases: ['took responsibility', 'here is what I learned', 'put a process in place so it never happened again'],
    followUps: ['What would you do differently?', 'Has that lesson been useful since?'],
  },
  {
    id: 'beh-13',
    category: 'Failure & Learning',
    question: 'Describe a time a project you were working on failed. What happened?',
    interviewerLooksFor: 'Root cause analysis, resilience, post-mortems, systemic thinking vs. blame.',
    powerPhrases: ['ran a post-mortem', 'identified root causes', 'blameless retrospective'],
    followUps: ['What was the impact?', 'What did you ship instead?'],
  },
  {
    id: 'beh-14',
    category: 'Failure & Learning',
    question: 'Tell me about a time you received difficult feedback and how you handled it.',
    interviewerLooksFor: 'Coachability, non-defensiveness, ability to act on feedback vs. dismiss it.',
    powerPhrases: ['sat with the feedback', 'asked clarifying questions', 'made a concrete action plan'],
    followUps: ['Who gave it? Did your relationship change?'],
  },
  {
    id: 'beh-15',
    category: 'Failure & Learning',
    question: 'Tell me about a time you had to change course mid-project because of new information.',
    interviewerLooksFor: 'Adaptability, intellectual humility, pivot without drama.',
    powerPhrases: ['updated my mental model', 'quickly re-prioritized', 'communicated the pivot early'],
    followUps: ['Who was most affected? How did you communicate the change?'],
  },
  {
    id: 'beh-16',
    category: 'Failure & Learning',
    question: 'Describe a time you shipped something you later regretted. How did you handle it?',
    interviewerLooksFor: 'Ownership after the fact, cleanup behavior, communication to stakeholders.',
    powerPhrases: ['took full ownership', 'immediately communicated the issue', 'had a rollback plan'],
    followUps: ['What changed in your process afterward?'],
  },
  // Technical Decision-Making
  {
    id: 'beh-17',
    category: 'Technical Decision-Making',
    question: 'Walk me through a complex technical decision you made and the trade-offs involved.',
    interviewerLooksFor: 'Structured thinking, trade-off analysis (speed vs. quality, build vs. buy), data-backed reasoning.',
    powerPhrases: ['weighed the trade-offs', 'considered long-term maintenance', 'used a decision matrix'],
    followUps: ['Would you make the same call today?', 'What would have happened with the other option?'],
  },
  {
    id: 'beh-18',
    category: 'Technical Decision-Making',
    question: 'Tell me about a time you had to push back on a feature request for technical reasons.',
    interviewerLooksFor: 'Technical advocacy, business empathy, constructive alternatives.',
    powerPhrases: ['explained the technical cost clearly', 'proposed an alternative', 'quantified the risk'],
    followUps: ['Did they accept the pushback? What happened?'],
  },
  {
    id: 'beh-19',
    category: 'Technical Decision-Making',
    question: 'Describe a time you had to tackle significant technical debt.',
    interviewerLooksFor: 'Pragmatism, business justification for refactoring, phased approach.',
    powerPhrases: ['made the business case', 'did it incrementally', 'measured before and after'],
    followUps: ['How did you get buy-in? What was the ROI?'],
  },
  {
    id: 'beh-20',
    category: 'Technical Decision-Making',
    question: 'Tell me about a time you had to choose between speed and quality.',
    interviewerLooksFor: 'Contextual judgment, no ideological rigidity, acknowledging trade-offs clearly.',
    powerPhrases: ['documented the shortcuts', 'set a date to revisit', 'communicated the risk upward'],
    followUps: ['Did the debt come back to bite you?'],
  },
  {
    id: 'beh-21',
    category: 'Technical Decision-Making',
    question: 'Walk me through a system design or architecture decision you influenced.',
    interviewerLooksFor: 'Depth of technical knowledge, scalability thinking, ability to influence architecture.',
    powerPhrases: ['considered scalability from the start', 'evaluated multiple approaches', 'wrote an RFC or design doc'],
    followUps: ['What would you change with hindsight?'],
  },
  {
    id: 'beh-22',
    category: 'Technical Decision-Making',
    question: 'Tell me about a time you introduced a new technology or tool to your team.',
    interviewerLooksFor: 'Innovation, persuasion, proof-of-concept mindset, measured adoption.',
    powerPhrases: ['ran a spike', 'built a proof of concept', 'shared learnings with the team'],
    followUps: ['Did it stick? Any downsides?'],
  },
  // Ambiguity & Initiative
  {
    id: 'beh-23',
    category: 'Ambiguity & Initiative',
    question: 'Tell me about a time you had to work in a highly ambiguous situation.',
    interviewerLooksFor: 'Comfort with uncertainty, ability to make structure from chaos, proactive clarification.',
    powerPhrases: ['defined the problem space', 'asked the right clarifying questions', 'created a north star and worked backward'],
    followUps: ['What was the biggest risk? How did you mitigate it?'],
  },
  {
    id: 'beh-24',
    category: 'Ambiguity & Initiative',
    question: 'Tell me about a time you identified and solved a problem before anyone asked you to.',
    interviewerLooksFor: 'Self-direction, pattern recognition, proactive problem-solving, entrepreneurial mindset.',
    powerPhrases: ['noticed the pattern', 'built a solution on the side', 'presented it and got buy-in'],
    followUps: ['What motivated you? Was it appreciated?'],
  },
  {
    id: 'beh-25',
    category: 'Ambiguity & Initiative',
    question: 'Describe a situation where requirements kept changing. How did you manage it?',
    interviewerLooksFor: 'Adaptability, stakeholder communication, scope management, resilience.',
    powerPhrases: ['locked scope incrementally', 'set up a change log', 'regular check-ins to catch shifts early'],
    followUps: ['What caused the changes? Was it avoidable?'],
  },
  {
    id: 'beh-26',
    category: 'Ambiguity & Initiative',
    question: 'Tell me about a time you had to juggle multiple high-priority projects simultaneously.',
    interviewerLooksFor: 'Prioritization, communication of constraints, focus vs. context-switching.',
    powerPhrases: ['explicitly negotiated priorities with stakeholders', 'time-blocked ruthlessly', 'communicated trade-offs'],
    followUps: ['Did anything slip? What would you do differently?'],
  },
  {
    id: 'beh-27',
    category: 'Ambiguity & Initiative',
    question: 'Tell me about a time you improved a process or workflow on your team.',
    interviewerLooksFor: 'Continuous improvement mindset, data-driven process changes, team impact.',
    powerPhrases: ['identified a bottleneck', 'proposed and iterated on a solution', 'measured the before/after'],
    followUps: ['Did it stick? How long did it take to see results?'],
  },
  {
    id: 'beh-28',
    category: 'Ambiguity & Initiative',
    question: 'Describe a time you had to build something with little or no guidance.',
    interviewerLooksFor: 'Self-sufficiency, resourcefulness, comfort with 0-to-1 building.',
    powerPhrases: ['defined success criteria myself', 'found internal experts to learn from', 'shipped a v1 fast and iterated'],
    followUps: ['What was your biggest uncertainty? How did you resolve it?'],
  },
  {
    id: 'beh-29',
    category: 'Ambiguity & Initiative',
    question: 'Tell me about a time you had to prioritize ruthlessly. What did you say no to?',
    interviewerLooksFor: 'Saying no gracefully, opportunity cost thinking, focus as a strategy.',
    powerPhrases: ['said no with a clear rationale', 'showed the cost of doing everything', 'focused on highest leverage'],
    followUps: ['Was the thing you cut a mistake in retrospect?'],
  },
  {
    id: 'beh-30',
    category: 'Ambiguity & Initiative',
    question: 'Tell me about a time you had to rally a team that was demotivated or struggling.',
    interviewerLooksFor: 'Leadership empathy, morale-building, identifying root causes of low energy.',
    powerPhrases: ['diagnosed the root cause', 'removed blockers', 'celebrated small wins', 'made space for concerns'],
    followUps: ['What was the root cause of the low morale? How long did recovery take?'],
  },
]

export const BEHAVIORAL_CATEGORIES: BehavioralCategory[] = [
  'Leadership & Ownership',
  'Conflict & Collaboration',
  'Failure & Learning',
  'Technical Decision-Making',
  'Ambiguity & Initiative',
]

export const CATEGORY_COLORS: Record<BehavioralCategory, string> = {
  'Leadership & Ownership': 'text-gold border-gold/30 bg-gold/10',
  'Conflict & Collaboration': 'text-medium border-medium/30 bg-medium/10',
  'Failure & Learning': 'text-hard border-hard/30 bg-hard/10',
  'Technical Decision-Making': 'text-easy border-easy/30 bg-easy/10',
  'Ambiguity & Initiative': 'text-blue-400 border-blue-400/30 bg-blue-400/10',
}
