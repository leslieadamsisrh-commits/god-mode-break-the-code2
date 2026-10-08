# Psychic Grip Flow & Bot Memory37

Parent verified live: daee606522cc625d32ce43bb7005501f5f04aa30. Same studio/live-app-three-section-01 branch and Railway playtest service; no master/checkpoint edits or regenerated assets.

## Shared mechanics
- Current right-stick target updates immediately. Translation, orbit and shell rotation have independent, bounded acceleration with existing mass resistance,660-unit translation cap and3.84-radian angular cap. The new acceleration stage is new work; swept orbital carrying was recovered in27.
- Preserves Grip Strength36 factor1.2 and all DEFAULT_CONFIG values. Voluntary drop/slide/fling and explicit LB+fresh RT throw retain eligibility, momentum, energy costs, ownership and one-hit-per-flight collision. Free roam now uses the same swept carry as practice/duel.
- Historical source inspected: experiments/shotgun-powered-duel/lab-psychic-cover.js at efecc43dc7880ddf6831a1c40cbb694ab4dbed7e. Recovered hoverHeight12 and response14. This is cosmetic elevation; deck hulls, actor contacts, shots and cover protection remain grounded. Constrained carry lowers the cosmetic lift; releases settle. No obstacle bypass or immunity.
- Acquisition pulses, both fighters' tether, ground shadows and short velocity-driven fling trails use existing rendering/ink conventions. Existing release-motion road scrapes remain tied to authoritative physical motion.

## Bot policy
Removed compulsory0.55-second settling and1.25-second placement demonstrations. Release readiness uses actual outward velocity and position; a constrained hold gets ordinary RT execution after0.18 seconds, with0.85-second fallback. Defensive placement, outward attacks and post-release re-acquisition cooldown reduce pointless repeated grabs. Bot policy is separate; shared rules, costs and ordinary inputs are preserved.

## Experience and reports
Browser-local persistence, no cloud or cross-device sync. Server rooms remain temporary. Completed profiles and the last completed report are fetched once per rematch/report completion; quota/export errors are nonblocking. Same-tab Watch reload restores the room where available. Baseline stores evidence but applies no learned adjustments. Adaptive resumes the saved profile; Reset Memory clears experience and returns to baseline.
Schema1 / strategy grip-flow37-v1. Accepted eligible releases form tactical trials; rejected inputs are separately counted and do not poison strategy scores. Between-round aggregates only. Preferences can influence at most one in ten acquisition opportunities and require four comparable trials. No changes to physics, energy, damage or privileged resources.
Record10 Rounds starts a fresh round, alternates spawn sides, includes completed draws, excludes paused/countdown time and records abandoned resets separately. Recording locks strategy/profile changes. Report includes starting/final profiles, active durations, launches/contact/damage/blocks/follow-ups/escape/recovery/battery loss, rejection reasons, intent changes, control/release timings, blocked holds, recharge duration, spawn comparisons and detected failures. Exact commit uses Railway's RAILWAY_GIT_COMMIT_SHA; a missing runtime SHA is exported as null rather than invented. Initial config is included.
Caps:96 experience contexts per fighter,96 eligible trials per round,64 timing samples per metric,320 evidence events per round (first160 plus latest160),10 completed rounds,2MB local compact storage /4MB formatted download. JSON contains no names, tokens, lobby codes, invites, source code or executable modifications.

## Controller unchanged
LS move; RS aim / position held matter. A boost/double-tap Weave/brace/escape. B melee. X tap projectile-time toggle. Y hold charge/release God. LB hold Grip; release near/settled placement, moving middle reach slide, moving outward far reach fling. LB+fresh RT explicit throw. Release RT before a fresh shot. LT shield/plant or braced exposure. RB selected power. D-pad Left reach; Up power selection; Down verified shotgun; Right reserved.

## Verification
Automated: Grip35/36, connections34, restoration27, matter33, integration31, psychic29 (1500 frozen movement frames), three-cover25, combat26; new memory37 uses real ordinary-input ten-round baseline/adaptive runs; version/reset/pause/abandon/privacy/cap/eligibility tests; actual client persistence/export helper tests with mocked browser storage. Production build passes with existing CSS autoprefixer warnings.
Visual: actual Canvas renderer with approved environment assets and approved ready-d00 Jade audit pose: eight bot/edge panels,144 hover rotations across three cover types and both slots, plus128 full scene rotation/camera cases,80 actor review cells and missing-art fallback. These renders do not validate all animation atlases or real GPU frame pacing.
Local network: authenticated Watch memory/control/restore and two independent player HTTP/SSE clients with imposed0/80/160ms uplink delays; analog Grip and stale-input cleanup, pause/rematch/privacy/isolation. Local measurements are not real-controller or internet latency validation.

## Remaining debt
Wins remain uneven across sides/slots; sparse comparable experience and small samples do not establish an Adaptive advantage. Some recharge stretches exceed30% of exchanges; reaction-driven failed requests remain. Dedicated carrying, wince and shield poses need a later approved animation pass. Hover is cosmetic, not physical flight. Real controller feel, mobile/Safari storage/download behavior and internet multiplayer remain playtest work.

## Usage
Same URL with ?watch=1. Open FIGHT MEMORY. Choose Baseline or Adaptive; Record10 Rounds; optionally pause/resume; after ten completed rounds Download Fight Report. Upload JSON with video for analysis. Completed reports persist in this browser when storage is available; a new recording retains the previous report until replaced.

## Measured runs
{
  "ten_round_runs": [
    {
      "mode": "baseline",
      "ticks": 15428,
      "spawnComparison": {
        "left": {
          "rounds": 10,
          "wins": 8,
          "launches": 78,
          "followUps": 11,
          "blockedSeconds": 1.7166666666661397
        },
        "right": {
          "rounds": 10,
          "wins": 2,
          "launches": 95,
          "followUps": 16,
          "blockedSeconds": 2.39999999999931
        }
      },
      "failures": [
        "Recharge exceeds30% of an exchange"
      ],
      "meanAcquisitionToRelease": 0.13253493013967926,
      "rounds": [
        {
          "winner": 0,
          "seconds": 5.183333333333265,
          "launches": [
            1,
            2
          ],
          "followUps": [
            0,
            1
          ],
          "blocked": [
            0.1499999999999945,
            0.016666666666666666
          ],
          "charging": [
            1.8999999999999981,
            0.7666666666666507
          ]
        },
        {
          "winner": 0,
          "seconds": 13.766666666666897,
          "launches": [
            7,
            6
          ],
          "followUps": [
            2,
            1
          ],
          "blocked": [
            0,
            0.016666666666666666
          ],
          "charging": [
            6.6999999999999815,
            7.649999999999978
          ]
        },
        {
          "winner": 0,
          "seconds": 9.849999999998476,
          "launches": [
            1,
            5
          ],
          "followUps": [
            1,
            1
          ],
          "blocked": [
            0,
            0.16666666666664245
          ],
          "charging": [
            1.8999999999997201,
            4.799999999999301
          ]
        },
        {
          "winner": 1,
          "seconds": 37.84999999999669,
          "launches": [
            18,
            16
          ],
          "followUps": [
            2,
            1
          ],
          "blocked": [
            0.4499999999999733,
            0.44999999999998297
          ],
          "charging": [
            23.383333333332168,
            23.666666666665478
          ]
        },
        {
          "winner": 1,
          "seconds": 26.48333333333311,
          "launches": [
            9,
            15
          ],
          "followUps": [
            1,
            3
          ],
          "blocked": [
            0.2333333333333333,
            0.6666666666666671
          ],
          "charging": [
            14.03333333333361,
            15.116666666666998
          ]
        },
        {
          "winner": 1,
          "seconds": 34.616666666649714,
          "launches": [
            14,
            17
          ],
          "followUps": [
            1,
            3
          ],
          "blocked": [
            0.3333333333331393,
            0.2999999999998254
          ],
          "charging": [
            18.833333333322702,
            21.533333333321245
          ]
        },
        {
          "winner": 0,
          "seconds": 9.249999999994566,
          "launches": [
            1,
            5
          ],
          "followUps": [
            1,
            1
          ],
          "blocked": [
            0.06666666666662786,
            0.16666666666656968
          ],
          "charging": [
            1.8999999999988983,
            4.16666666666423
          ]
        },
        {
          "winner": 1,
          "seconds": 24.69999999998638,
          "launches": [
            12,
            13
          ],
          "followUps": [
            2,
            1
          ],
          "blocked": [
            0.2166666666665406,
            0.24999999999985456
          ],
          "charging": [
            14.983333333324518,
            14.949999999991205
          ]
        },
        {
          "winner": 0,
          "seconds": 9.849999999994212,
          "launches": [
            1,
            5
          ],
          "followUps": [
            1,
            1
          ],
          "blocked": [
            0,
            0.16666666666656968
          ],
          "charging": [
            1.8999999999988983,
            4.79999999999719
          ]
        },
        {
          "winner": 1,
          "seconds": 24.69999999998638,
          "launches": [
            12,
            13
          ],
          "followUps": [
            2,
            1
          ],
          "blocked": [
            0.2166666666665406,
            0.24999999999985456
          ],
          "charging": [
            14.983333333324518,
            14.949999999991205
          ]
        }
      ]
    },
    {
      "mode": "adaptive",
      "ticks": 13747,
      "spawnComparison": {
        "left": {
          "rounds": 10,
          "wins": 3,
          "launches": 74,
          "followUps": 13,
          "blockedSeconds": 1.6166666666661935
        },
        "right": {
          "rounds": 10,
          "wins": 7,
          "launches": 75,
          "followUps": 8,
          "blockedSeconds": 1.3999999999995796
        }
      },
      "failures": [
        "Recharge exceeds30% of an exchange",
        "Launches without confirmed movement-to-hit follow-ups"
      ],
      "meanAcquisitionToRelease": 0.18923395445128957,
      "rounds": [
        {
          "winner": 1,
          "seconds": 23.366666666665953,
          "launches": [
            8,
            10
          ],
          "followUps": [
            2,
            1
          ],
          "blocked": [
            0.016666666666666666,
            0.01666666666666606
          ],
          "charging": [
            11.483333333333317,
            12.200000000000014
          ]
        },
        {
          "winner": 0,
          "seconds": 22.23333333333045,
          "launches": [
            16,
            12
          ],
          "followUps": [
            1,
            1
          ],
          "blocked": [
            0.1833333333333067,
            0.1833333333333067
          ],
          "charging": [
            14.133333333331109,
            11.149999999998263
          ]
        },
        {
          "winner": 0,
          "seconds": 7.866666666666169,
          "launches": [
            2,
            3
          ],
          "followUps": [
            2,
            0
          ],
          "blocked": [
            0,
            0.14999999999999514
          ],
          "charging": [
            2.3999999999999964,
            2.849999999999959
          ]
        },
        {
          "winner": 0,
          "seconds": 11.466666666666816,
          "launches": [
            2,
            5
          ],
          "followUps": [
            1,
            1
          ],
          "blocked": [
            0,
            0.06666666666666667
          ],
          "charging": [
            4.049999999999991,
            2.2166666666666637
          ]
        },
        {
          "winner": 1,
          "seconds": 23.383333333333287,
          "launches": [
            10,
            5
          ],
          "followUps": [
            1,
            1
          ],
          "blocked": [
            0.3,
            0.19999999999999998
          ],
          "charging": [
            10.366666666666761,
            10.083333333333414
          ]
        },
        {
          "winner": 1,
          "seconds": 27.0333333333229,
          "launches": [
            13,
            11
          ],
          "followUps": [
            1,
            2
          ],
          "blocked": [
            0.4999999999998155,
            0.43333333333324586
          ],
          "charging": [
            16.199999999992837,
            13.69999999999391
          ]
        },
        {
          "winner": 1,
          "seconds": 11.416666666659955,
          "launches": [
            7,
            5
          ],
          "followUps": [
            0,
            1
          ],
          "blocked": [
            0.2999999999998254,
            0.016666666666656966
          ],
          "charging": [
            5.899999999996541,
            4.933333333330444
          ]
        },
        {
          "winner": 0,
          "seconds": 22.233333333320907,
          "launches": [
            16,
            12
          ],
          "followUps": [
            1,
            1
          ],
          "blocked": [
            0.18333333333322666,
            0.18333333333322666
          ],
          "charging": [
            14.13333333332502,
            11.149999999993446
          ]
        },
        {
          "winner": 0,
          "seconds": 7.866666666662048,
          "launches": [
            2,
            3
          ],
          "followUps": [
            2,
            0
          ],
          "blocked": [
            0,
            0.1499999999999127
          ],
          "charging": [
            2.399999999998605,
            2.8499999999983396
          ]
        },
        {
          "winner": 0,
          "seconds": 11.416666666659955,
          "launches": [
            2,
            5
          ],
          "followUps": [
            1,
            1
          ],
          "blocked": [
            0,
            0.13333333333325573
          ],
          "charging": [
            4.083333333330946,
            1.9833333333321836
          ]
        }
      ]
    }
  ],
  "five_minute_swapped_bot_runs": [
    {
      "swapped": false,
      "rounds": 15,
      "wins": [
        11,
        3
      ],
      "chains": 32,
      "throwHits": 20,
      "shieldContacts": 90,
      "recoveredMovement": 164,
      "activated": {
        "grip": 184,
        "throw": 157,
        "movement": 99,
        "shotgun": 356,
        "time": 18,
        "brace": 5,
        "shield": 41,
        "build": 88,
        "charge": 200,
        "orbit": 17,
        "place": 12,
        "melee": 7
      },
      "releaseKinds": {
        "gesture slide": 46,
        "gesture launch": 32,
        "gesture drop": 12
      },
      "failures": {
        "cooldown or incompatible state": 5,
        "reaction": 111,
        "no eligible target/action": 17
      },
      "simulationMs": 3946
    },
    {
      "swapped": true,
      "rounds": 11,
      "wins": [
        7,
        3
      ],
      "chains": 28,
      "throwHits": 17,
      "shieldContacts": 84,
      "recoveredMovement": 123,
      "activated": {
        "orbit": 20,
        "throw": 204,
        "shotgun": 340,
        "time": 21,
        "movement": 103,
        "shield": 41,
        "build": 123,
        "grip": 243,
        "charge": 191,
        "pinball": 1,
        "place": 16,
        "melee": 2,
        "brace": 1
      },
      "releaseKinds": {
        "gesture slide": 60,
        "gesture launch": 45,
        "gesture drop": 16
      },
      "failures": {
        "no eligible target/action": 20,
        "reaction": 117,
        "cooldown or incompatible state": 4
      },
      "simulationMs": 4374
    }
  ]
}