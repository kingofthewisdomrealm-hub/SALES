const PHASES = [
  {id:"approach", n:"0", name:"Approach"},
  {id:"connection", n:"1", name:"Connection"},
  {id:"situation", n:"2", name:"Situation"},
  {id:"problem", n:"3", name:"Problem"},
  {id:"solution", n:"4", name:"Solution"},
  {id:"consequence", n:"5", name:"Consequence"},
  {id:"commitment", n:"6", name:"Commitment"},
  {id:"presentation", n:"7", name:"Presentation"},
  {id:"next", n:"8", name:"Next step"}
];

const PEOPLE = {
  dale: {
    id:"dale", name:"Dale Hart", role:"The guarded",
    hair:"short", body:"buyer-a",
    blurb:"Twenty-two years in the same bungalow. Does not want a stranger on his roof, or a pitch on his porch.",
    fear:"If I give him an inch he sells me a whole roof.",
    proofNeed:"something he can verify without trusting you"
  },
  gene: {
    id:"gene", name:"Gene Walsh", role:"The burned",
    hair:"silver", body:"buyer-b",
    blurb:"Paid a storm chaser four thousand dollars. The truck left. The leak did not.",
    fear:"Magnet signs lie. Deposits vanish.",
    proofNeed:"no money up front and a neighbor he already knows"
  }
};

const OPTIONS = [
  {id:"pitch-fast", scene:1, phase:"presentation", label:"Pitch",
    line:"We're Harbor & Ridge — storm restoration, insurance help, the whole package. I can walk the roof right now.",
    coachJump:"You presented on the welcome mat. He doesn't know you, and he hasn't said he has a problem.",
    reply:{
      dale:{say:"Yeah, that's what the last three guys opened with.", think:"Told you. It's a pitch.", guard:2},
      gene:{say:"I already bought a package once. Still have the leak.", think:"Same energy as the guy who took the check.", guard:2}
    }
  },
  {id:"connect-ask", scene:1, phase:"connection", label:"Connection",
    line:"I don't want to take your afternoon. Mind if I ask how the house handled that last band of weather — just so I'm not guessing?",
    coach:"Curious, not eager. You asked for permission and made it about his house.",
    reply:{
      dale:{say:"Handled it fine. House has been here longer than you have.", think:"At least he asked instead of launching.", guard:-1},
      gene:{say:"The weather's not the part I remember.", think:"He didn't sell yet. I'll give him thirty seconds.", guard:-1}
    }
  },
  {id:"connect-hype", scene:1, phase:"connection", label:"Hype",
    line:"Great to meet you! You're going to love what we can do for homeowners on this street.",
    coachJump:"Enthusiasm reads as commission. Connection is supposed to lower the wall, not raise a show.",
    reply:{
      dale:{say:"I'm sure I would.", think:"Smile and get rid of him.", guard:1},
      gene:{say:"I loved it last time too.", think:"Here we go again.", guard:1}
    }
  },
  {id:"sit-stain", scene:1, phase:"situation", label:"Situation",
    line:"When you walk the hall in the morning — any marks on a ceiling, or is it still looking the way it did last year?",
    coach:"Situation is facts. You asked what is true today, not what it means.",
    reply:{
      dale:{say:"There's a tea-colored spot in the hall. Been there. I wipe it.", think:"I said it. Don't make me regret that.", guard:0, fact:true},
      gene:{say:"Kitchen ceiling. It came back after they 'fixed' it.", think:"He can look at a stain. That isn't a contract.", guard:0, fact:true}
    }
  },
  {id:"sit-guess", scene:1, phase:"situation", label:"Diagnose",
    line:"From the yard I can already tell those shingles are done. You're looking at a full tear-off.",
    coachJump:"You diagnosed from the sidewalk. Situation questions collect facts. They don't deliver verdicts.",
    reply:{
      dale:{say:"You haven't been on it. Don't tell me what I'm looking at.", think:"Stranger with a crystal ball. No.", guard:2},
      gene:{say:"That's what the last one said. Then he wanted a check.", think:"Verdict first, work never.", guard:2}
    }
  },
  {id:"prob-own", scene:1, phase:"problem", label:"Problem",
    line:"That spot you wipe — is that just ugly, or has it started turning into something you actually have to manage?",
    coach:"Problem awareness is them naming the difficulty. You pointed at their words, not your product.",
    reply:{
      dale:{say:"It's spreading toward the bedroom wall. I don't love that.", think:"Fine. It's a problem. I still don't trust him.", owned:true, guard:-1},
      gene:{say:"It's a problem. I already paid once to make it not a problem.", think:"Naming it doesn't mean I hire him.", owned:true, guard:0}
    }
  },
  {id:"prob-tell", scene:1, phase:"problem", label:"Lecture",
    line:"That's moisture intrusion. If you ignore it you're going to have rot in the decking.",
    coachJump:"You named the problem for him. Ownership didn't transfer. He can reject your science.",
    reply:{
      dale:{say:"Maybe. Or maybe it's just an old house.", think:"Don't scare me into a ladder.", guard:1},
      gene:{say:"Rot. Mold. Deck. I know the speech.", think:"Fear close. Cheap.", guard:1}
    }
  },
  {id:"proof-match", scene:1, phase:"connection", label:"Matched proof",
    line:"", dynamic:true,
    coach:"Proof that answers the fear they actually have. Not a brochure.",
    lines:{
      dale:"State license is on my card. We're insured. Look the number up while I'm standing here — I can wait.",
      gene:"We don't take a deposit. You don't pay until the work is done and you're looking at it. The Hendersons two streets over can tell you if we showed up."
    },
    reply:{
      dale:{say:"Alright. That's a real number. I'll look at it.", think:"Still a stranger. Slightly less of a ghost.", trust:2, guard:-1},
      gene:{say:"No deposit. And I know Marie Henderson.", think:"If Marie vouches, that's something.", trust:2, guard:-1}
    }
  },
  {id:"proof-vague", scene:1, phase:"connection", label:"Vague proof",
    line:"We're the good guys. Quality work, local, you can trust us.",
    coachJump:"'Trust us' is what the last guy said. Proof has to match the fear.",
    reply:{
      dale:{say:"Everybody's local until they aren't.", think:"Empty calories.", guard:1},
      gene:{say:"He said quality too.", think:"Words are free.", guard:1}
    }
  },
  {id:"commit-look", scene:1, phase:"commitment", label:"Commitment",
    line:"If that mark is still moving, do you want a look at where it's coming from — or would you rather leave it?",
    coach:"Commitment question. He has to say he wants the look. You didn't assume the ladder.",
    reply:{
      dale:{say:"I want to know where it's coming from. That's all I'm saying.", think:"A look is not a contract.", intent:true, trust:1},
      gene:{say:"I want to know if they actually fixed anything. Look. No check.", think:"He asked. I answered. Still no money.", intent:true, trust:1}
    }
  },
  {id:"inspect-push", scene:1, phase:"next", label:"Assume the ladder",
    line:"Great — ladder's on the truck. I'll be up in two minutes.",
    coachJump:"You skipped the commitment question and announced the next step. Assumptive close on a guarded porch.",
    reply:{
      dale:{say:"Nobody's going up there today.", think:"Too fast.", guard:2},
      gene:{say:"That's how the last one started.", think:"Ladder, then invoice.", guard:2}
    }
  },
  {id:"exit-clean", scene:1, phase:"next", label:"Leave clean",
    line:"I hear you. Card's on the door. If that mark grows, you already have the number.",
    coach:"Respect exit. Not a win, not a wreck. Use it when the wall is still up.",
    end:"followup",
    reply:{
      dale:{say:"Appreciate that more than the pitch.", think:"Maybe I call. Maybe I don't."},
      gene:{say:"That's the first decent thing anybody's said this month.", think:"Card in the drawer. Not in the trash."}
    }
  },
  {id:"recap", scene:2, phase:"situation", label:"Recap",
    line:"From the look: the hall stain tracks to a lifted course on the south slope. That's the fact. Not the speech.",
    coach:"You put findings in situation language — what is true — before you sold a system.",
    reply:{
      dale:{say:"So it's not just paint.", think:"He showed me a photo. Harder to dismiss.", fact:true},
      gene:{say:"Same slope the other guy 'sealed.'", think:"At least this one came back with pictures.", fact:true}
    }
  },
  {id:"binder", scene:2, phase:"presentation", label:"Full binder",
    line:"Let me run you through every package we offer, financing, and the lifetime workmanship story.",
    coachJump:"Presentation before they described the outcome they want. The binder is how you lose the table.",
    reply:{
      dale:{say:"That's a lot of paper for a stain.", think:"Here comes the hour.", guard:2},
      gene:{say:"Packages. Financing. I know this folder.", think:"Walk.", guard:2}
    }
  },
  {id:"want", scene:2, phase:"solution", label:"Solution",
    line:"If this were handled the way you'd actually want it handled — what would 'handled' look like? Not the brand. The result.",
    coach:"Solution awareness. He has to describe the finish line before you show a scope.",
    reply:{
      dale:{say:"The mark stops. I don't climb a ladder every storm. Nobody hits me for half the job up front.", think:"That's all I want. Don't decorate it.", want:true},
      gene:{say:"It stays fixed. I pay when I can see it stayed fixed.", think:"Say that back to me and I might listen.", want:true}
    }
  },
  {id:"cost", scene:2, phase:"consequence", label:"Consequence",
    line:"If nothing changes before the next wet month — what does that do to the bedroom wall you already don't love?",
    coach:"Consequence in his house, not in your brochure. Urgency he speaks.",
    reply:{
      dale:{say:"Then I'm painting a bigger stain. Or worse, I'm opening walls.", think:"I can see that. I hate that I can see that.", cost:true, guard:-1},
      gene:{say:"Then I paid four thousand dollars to watch it come back again.", think:"That's the part that keeps me up.", cost:true, guard:-1}
    }
  },
  {id:"commit2", scene:2, phase:"commitment", label:"Commitment",
    line:"Knowing that — do you want this taken care of, or do you want to watch one more season and decide later?",
    coach:"They say the close. You did not.",
    reply:{
      dale:{say:"I want it taken care of. I don't want a circus.", think:"Yes. Carefully.", intent:true},
      gene:{say:"I want it done. I do not want a deposit.", think:"Yes, with a fence around the money.", intent:true}
    }
  },
  {id:"present-match", scene:2, phase:"presentation", label:"Matched scope",
    line:"Then the only piece that matters is the south slope and the hall path. Repair that course, dry the deck, close the stain. No whole-roof speech unless the photos say so.",
    coach:"Presentation last, and only the part that answers what he described.",
    reply:{
      dale:{say:"That's the job I actually asked for.", think:"He used my words. That's new.", trust:1},
      gene:{say:"And I pay when it's done.", think:"Say it. Out loud.", trust:1}
    }
  },
  {id:"next-book", scene:2, phase:"next", label:"Next step",
    line:"If we're doing that, is Thursday morning or Saturday better to start the dry-in?",
    coach:"A time choice, after intent. That's a next step, not a wrestle.",
    end:"signed",
    reply:{
      dale:{say:"Thursday. Be on time.", think:"Alright. We'll see."},
      gene:{say:"Saturday. Marie can wander over if she wants.", think:"Still no check today. Good."}
    }
  },
  {id:"next-pushpay", scene:2, phase:"next", label:"Ask for money",
    line:"I can lock the crew if I can take a deposit today.",
    coachJump:"You put money in front of the fear. Gene will bolt. Dale will freeze.",
    reply:{
      dale:{say:"That's enough for today.", think:"Should've known.", guard:2},
      gene:{say:"There's the check. Get out.", think:"Never again.", guard:3}
    }
  }
];

const ENDINGS = {
  signed:{title:"Next step locked", kicker:"The sale they spoke",
    text:"They described the problem, the finish line, and the intent. You showed only that scope and asked for a time. That is the whole process on one table."},
  inspect:{title:"They asked for the look", kicker:"Scene 1 complete",
    text:"Commitment happened before the ladder. Findings come next — which is Scene 2."},
  followup:{title:"Door left open", kicker:"Clean exit",
    text:"No next step. Trust didn't go to zero either. A card and a quiet porch is sometimes the adult move."},
  wall:{title:"The wall came up", kicker:"Process broke",
    text:"Guard maxed. They stopped answering the question you thought you asked. Early pitch, sidewalk diagnosis, or money-too-soon is usually why."}
};
