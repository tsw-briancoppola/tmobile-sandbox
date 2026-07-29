const highSchoolData = [
  {
    id: 0,
    name: "Generic H.S.",
    city: "Stufftown",
    state: "WA",
    region: "West",
    votes: 22000,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    home_game: {
      stadium_name: "Generic Memorial Stadium",
      stadium_address: "100 School Rd, Stufftown, WA 98001",
      datetime: "2026-08-28T19:00:00-07:00",
    },
  },
  {
    id: 1,
    name: "Bigtime H.S.",
    city: "Gadgetville",
    state: "WA",
    region: "West",
    votes: 14283,
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.",
    home_game: {
      stadium_name: "Bigtime Athletic Complex",
      stadium_address: "200 Bigtime Blvd, Gadgetville, WA 98002",
      datetime: "2026-09-04T19:30:00-07:00",
    },
  },
  {
    id: 2,
    name: "Badass H.S.",
    city: "Itemburg",
    state: "WA",
    region: "West",
    votes: 17091,
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu libero sit amet quam egestas semper aenean ultricies mi vitae est.",
    home_game: {
      stadium_name: "Badass Field",
      stadium_address: "300 Warriors Way, Itemburg, WA 98003",
      datetime: "2026-08-21T18:00:00-07:00",
    },
  },
  {
    id: 3,
    name: "Standard H.S.",
    city: "Thing Creek",
    state: "WA",
    region: "West",
    votes: 10542,
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit. Mauris placerat eleifend leo quisque sit amet est et sapien ullamcorper pharetra.",
    home_game: {
      stadium_name: "Standard Stadium",
      stadium_address: "400 Panthers Dr, Thing Creek, WA 98004",
      datetime: "2026-09-11T19:00:00-07:00",
    },
  },
  {
    id: 4,
    name: "Typical H.S.",
    city: "Object City",
    state: "WA",
    region: "West",
    votes: 13219,
    description:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur. Vestibulum erat wisi condimentum sed commodo vitae ornare sit amet wisi.",
    home_game: {
      stadium_name: "Typical Tiger Stadium",
      stadium_address: "500 Tigers Ln, Object City, WA 98005",
      datetime: "2026-08-14T19:30:00-07:00",
    },
  },
  {
    id: 5,
    name: "Ordinary H.S.",
    city: "Article Junction",
    state: "WA",
    region: "West",
    votes: 9115,
    description:
      "Nam libero tempore cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet. Aenean fermentum risus id tortor integer ornare nunc interdum vel.",
    home_game: {
      stadium_name: "Ordinary Eagles Field",
      stadium_address: "600 Eagles Ave, Article Junction, WA 98006",
      datetime: "2026-09-18T18:30:00-07:00",
    },
  },
  {
    id: 6,
    name: "Common H.S.",
    city: "Material Falls",
    state: "WA",
    region: "West",
    votes: 12480,
    description:
      "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Nullam varius turpis aliquet diam elementum fermentum bibendum.",
    home_game: {
      stadium_name: "Common Community Stadium",
      stadium_address: "700 Common St, Material Falls, WA 98007",
      datetime: "2026-08-28T19:00:00-07:00",
    },
  },
  {
    id: 7,
    name: "Mediocre H.S.",
    city: "Entity Springs",
    state: "WA",
    region: "West",
    votes: 14722,
    description:
      "Ut labore et dolore magnam aliquam quaerat voluptatem enim ad minima veniam. Quis nostrum exercitationem ullam corporis suscipit laboriosam nisi ut aliquid ex ea commodi consequatur. Phasellus ultricies nulla id metus egestas ut lobortis eros aliquet.",
    home_game: {
      stadium_name: "Mediocre Mustangs Arena",
      stadium_address: "800 Mustang Rd, Entity Springs, WA 98008",
      datetime: "2026-09-04T19:30:00-07:00",
    },
  },
  {
    id: 8,
    name: "Regular H.S.",
    city: "Unit Village",
    state: "WA",
    region: "West",
    votes: 8933,
    description:
      "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur vel illum. Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit. Cras ornare tristique elit vivamus vestibulum ntulla nec ante.",
    home_game: {
      stadium_name: "Regular Raiders Field",
      stadium_address: "900 Raiders Blvd, Unit Village, WA 98009",
      datetime: "2026-08-21T18:00:00-07:00",
    },
  },
  {
    id: 9,
    name: "Normal H.S.",
    city: "Piece Port",
    state: "WA",
    region: "West",
    votes: 11674,
    description:
      "Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam quis nostrum exercitationem ullam corporis suscipit laboriosam. Praesent placerat risus quis eros fusce vehicula dolor arcu.",
    home_game: {
      stadium_name: "Normal Knights Stadium",
      stadium_address: "1000 Knights Way, Piece Port, WA 98010",
      datetime: "2026-09-11T19:00:00-07:00",
    },
  },
  {
    id: 10,
    name: "Dude H.S.",
    city: "Spiffytown",
    state: "MA",
    region: "East",
    votes: 12000,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris. Sed molestie augue sit amet leo consequat posuere.",
    home_game: {
      stadium_name: "Dude Dawgs Stadium",
      stadium_address: "100 Dawgs Dr, Spiffytown, MA 01001",
      datetime: "2026-08-14T19:00:00-04:00",
    },
  },
  {
    id: 11,
    name: "Spectacular H.S.",
    city: "Dapperburg",
    state: "MA",
    region: "East",
    votes: 14283,
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum. Vestibulum ante ipsum primis in faucibus orci luctus ultrices posuere.",
    home_game: {
      stadium_name: "Spectacular Spartans Field",
      stadium_address: "200 Spartans Ave, Dapperburg, MA 01002",
      datetime: "2026-08-28T19:30:00-04:00",
    },
  },
  {
    id: 12,
    name: "Awesome H.S.",
    city: "Snazzyville",
    state: "MA",
    region: "East",
    votes: 13091,
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam. Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nam pretium turpis et arcu duis ac augue lorem ipsum.",
    home_game: {
      stadium_name: "Awesome Falcons Arena",
      stadium_address: "300 Falcons Rd, Snazzyville, MA 01003",
      datetime: "2026-09-04T18:30:00-04:00",
    },
  },
  {
    id: 13,
    name: "Radical H.S.",
    city: "Posh Point",
    state: "MA",
    region: "East",
    votes: 9821,
    description:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores. Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit. Aliquam erat volutpat nam dui mi tincidunt quis accumsan porttitor.",
    home_game: {
      stadium_name: "Radical Rockets Stadium",
      stadium_address: "400 Rockets Blvd, Posh Point, MA 01004",
      datetime: "2026-08-21T19:00:00-04:00",
    },
  },
  {
    id: 14,
    name: "Excellent H.S.",
    city: "Nifty Heights",
    state: "MA",
    region: "East",
    votes: 12554,
    description:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti. Ut enim ad minima veniam quis nostrum exercitationem ullam corporis suscipit laboriosam nisi ut aliquid. Facilisis morbi ultricies leo risus porta sem lacinia quam ante.",
    home_game: {
      stadium_name: "Excellent Eagles Field",
      stadium_address: "500 Eagles Way, Nifty Heights, MA 01005",
      datetime: "2026-09-11T19:30:00-04:00",
    },
  },
  {
    id: 15,
    name: "Tubular H.S.",
    city: "Classy Corner",
    state: "MA",
    region: "East",
    votes: 14109,
    description:
      "Nam libero tempore cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates. Integer vitae libero ac risus egestas placerat nulla augue.",
    home_game: {
      stadium_name: "Tubular Thunder Dome",
      stadium_address: "600 Thunder Ln, Classy Corner, MA 01006",
      datetime: "2026-08-14T18:00:00-04:00",
    },
  },
  {
    id: 16,
    name: "Killer H.S.",
    city: "Swell Side",
    state: "MA",
    region: "East",
    votes: 8945,
    description:
      "Itaque earum rerum hic tenetur a sapiente delectus ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis. Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore. Proin quam etiam ultrices suspendisse in justo eu magna luctus.",
    home_game: {
      stadium_name: "Killer Cobras Stadium",
      stadium_address: "700 Cobras Dr, Swell Side, MA 01007",
      datetime: "2026-09-18T19:00:00-04:00",
    },
  },
  {
    id: 17,
    name: "Gnarly H.S.",
    city: "Flashy Field",
    state: "MA",
    region: "East",
    votes: 13202,
    description:
      "Ut labore et dolore magnam aliquam quaerat voluptatem ut enim ad minima veniam quis nostrum exercitationem. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur. Cum sociis natoque penatibus et magnis dis parturient montes nascetur.",
    home_game: {
      stadium_name: "Gnarly Grizzlies Field",
      stadium_address: "800 Grizzlies Ave, Flashy Field, MA 01008",
      datetime: "2026-08-28T19:30:00-04:00",
    },
  },
  {
    id: 18,
    name: "Superb H.S.",
    city: "Polished Park",
    state: "MA",
    region: "East",
    votes: 10776,
    description:
      "Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum. Quisque cursus etiam ultrices suspendisse commodo magna eros eu erat.",
    home_game: {
      stadium_name: "Superb Saints Arena",
      stadium_address: "900 Saints Blvd, Polished Park, MA 01009",
      datetime: "2026-09-04T18:30:00-04:00",
    },
  },
  {
    id: 19,
    name: "Choice H.S.",
    city: "Chic Center",
    state: "MA",
    region: "East",
    votes: 12891,
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Pellentesque condimentum augue ipsum venenatis ante lobortis accumsan.",
    home_game: {
      stadium_name: "Choice Champions Stadium",
      stadium_address: "1000 Champions Rd, Chic Center, MA 01010",
      datetime: "2026-08-21T19:00:00-04:00",
    },
  },
  {
    id: 20,
    name: "Dude H.S.",
    city: "Rockintown",
    state: "MI",
    region: "Midwest",
    votes: 14000,
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor. Duis lobortis massa imperdiet quam semper nunc justo aliquam.",
    home_game: {
      stadium_name: "Dude Devils Field",
      stadium_address: "100 Devils Dr, Rockintown, MI 48001",
      datetime: "2026-08-14T19:00:00-05:00",
    },
  },
  {
    id: 21,
    name: "Sassy H.S.",
    city: "Jammingville",
    state: "MI",
    region: "Midwest",
    votes: 14283,
    description:
      "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem. Vivamus pretium ornare est quisque sit amet pede justo fringilla.",
    home_game: {
      stadium_name: "Sassy Stallions Stadium",
      stadium_address: "200 Stallions Ave, Jammingville, MI 48002",
      datetime: "2026-08-28T19:30:00-05:00",
    },
  },
  {
    id: 22,
    name: "Awesome H.S.",
    city: "Grooveburg",
    state: "MI",
    region: "Midwest",
    votes: 13091,
    description:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores eos. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum. Aenean in sem ac leo mollis blandit nam pretium turpis.",
    home_game: {
      stadium_name: "Awesome Avalanche Arena",
      stadium_address: "300 Avalanche Blvd, Grooveburg, MI 48003",
      datetime: "2026-09-04T18:00:00-05:00",
    },
  },
  {
    id: 23,
    name: "Wicked H.S.",
    city: "Vibe Valley",
    state: "MI",
    region: "Midwest",
    votes: 11443,
    description:
      "Nam libero tempore cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere. Itaque earum rerum hic tenetur a sapiente delectus ut aut reiciendis voluptatibus maiores alias consequatur. Morbi in sem quis dui placerat ornare pellentesque odio nisi.",
    home_game: {
      stadium_name: "Wicked Wolves Field",
      stadium_address: "400 Wolves Way, Vibe Valley, MI 48004",
      datetime: "2026-09-11T19:00:00-05:00",
    },
  },
  {
    id: 24,
    name: "Prime H.S.",
    city: "Stellar Station",
    state: "MI",
    region: "Midwest",
    votes: 14605,
    description:
      "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur. Praesent dapibus neque id cursus faucibus tortor neque egestas.",
    home_game: {
      stadium_name: "Prime Panthers Stadium",
      stadium_address: "500 Panthers Dr, Stellar Station, MI 48005",
      datetime: "2026-08-21T19:30:00-05:00",
    },
  },
  {
    id: 25,
    name: "Phat H.S.",
    city: "Bumping Bend",
    state: "MI",
    region: "Midwest",
    votes: 9231,
    description:
      "Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem lorem ipsum. Ut enim ad minima veniam quis nostrum exercitationem ullam corporis suscipit laboriosam nisi ut aliquid ex ea. Nunc dignissim risus id metus ornare porttitor leo sapien.",
    home_game: {
      stadium_name: "Phat Phoenix Field",
      stadium_address: "600 Phoenix Ln, Bumping Bend, MI 48006",
      datetime: "2026-09-18T18:30:00-05:00",
    },
  },
  {
    id: 26,
    name: "Top-Tier H.S.",
    city: "Lively Lane",
    state: "MI",
    region: "Midwest",
    votes: 12988,
    description:
      "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit sed quia non numquam. Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore. Etiam sit amet orci eget eros faucibus tincidunt diam.",
    home_game: {
      stadium_name: "Top-Tier Titans Arena",
      stadium_address: "700 Titans Rd, Lively Lane, MI 48007",
      datetime: "2026-08-14T19:00:00-05:00",
    },
  },
  {
    id: 27,
    name: "Epic H.S.",
    city: "Electric Edge",
    state: "MI",
    region: "Midwest",
    votes: 10114,
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint. Occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum sed ut. Duis ante orci molestie sapien vehicula consequat erat ante.",
    home_game: {
      stadium_name: "Epic Eagles Stadium",
      stadium_address: "800 Eagles Blvd, Electric Edge, MI 48008",
      datetime: "2026-08-28T19:30:00-05:00",
    },
  },
  {
    id: 28,
    name: "Classic H.S.",
    city: "Beating Bridge",
    state: "MI",
    region: "Midwest",
    votes: 13540,
    description:
      "Perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur. Fusce pellentesque suscipit nibh integer vitae libero ac risus.",
    home_game: {
      stadium_name: "Classic Coliseum",
      stadium_address: "900 Classic Ave, Beating Bridge, MI 48009",
      datetime: "2026-09-04T18:00:00-05:00",
    },
  },
  {
    id: 29,
    name: "Solid H.S.",
    city: "Active Acres",
    state: "MI",
    region: "Midwest",
    votes: 11002,
    description:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti. Nam libero tempore cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod. Sed augue ipsum egestas nec vestibulum et volutpat ut diam.",
    home_game: {
      stadium_name: "Solid Steel Stadium",
      stadium_address: "1000 Steel Way, Active Acres, MI 48010",
      datetime: "2026-09-11T19:00:00-05:00",
    },
  },
  {
    id: 30,
    name: "Dude H.S.",
    city: "Neatotown",
    state: "GA",
    region: "South",
    votes: 12000,
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo. Suspendisse vel felis ut lorem egestas blandit accumsan.",
    home_game: {
      stadium_name: "Dude Bulldogs Field",
      stadium_address: "100 Bulldogs Dr, Neatotown, GA 30001",
      datetime: "2026-08-14T19:00:00-04:00",
    },
  },
  {
    id: 31,
    name: "Groovy H.S.",
    city: "Tidyton",
    state: "GA",
    region: "South",
    votes: 14283,
    description:
      "Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Curabitur pretium tincidunt lacus nulla mauris orci amet.",
    home_game: {
      stadium_name: "Groovy Gators Stadium",
      stadium_address: "200 Gators Ave, Tidyton, GA 30002",
      datetime: "2026-08-28T19:30:00-04:00",
    },
  },
  {
    id: 32,
    name: "Awesome H.S.",
    city: "Cleanville",
    state: "GA",
    region: "South",
    votes: 13091,
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam. Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo nemo. Integer in mauris eu nibh euismod gravida dui porta risus.",
    home_game: {
      stadium_name: "Awesome Armadillos Arena",
      stadium_address: "300 Armadillos Blvd, Cleanville, GA 30003",
      datetime: "2026-09-04T18:30:00-04:00",
    },
  },
  {
    id: 33,
    name: "Neat H.S.",
    city: "Trim Terrace",
    state: "GA",
    region: "South",
    votes: 14339,
    description:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores eos. Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit. Nulla consequat massa quis enim donec pede justo fringilla vel.",
    home_game: {
      stadium_name: "Neat Nighthawks Field",
      stadium_address: "400 Nighthawks Rd, Trim Terrace, GA 30004",
      datetime: "2026-08-21T19:00:00-04:00",
    },
  },
  {
    id: 34,
    name: "Fly H.S.",
    city: "Orderly Oasis",
    state: "GA",
    region: "South",
    votes: 11506,
    description:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae. Aliquam lorem ante dapibus in viverra quis feugiat a tellus.",
    home_game: {
      stadium_name: "Fly Falcons Stadium",
      stadium_address: "500 Falcons Way, Orderly Oasis, GA 30005",
      datetime: "2026-09-11T19:30:00-04:00",
    },
  },
  {
    id: 35,
    name: "Sharp H.S.",
    city: "Smart Shore",
    state: "GA",
    region: "South",
    votes: 9422,
    description:
      "Nam libero tempore cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat. Itaque earum rerum hic tenetur a sapiente delectus ut aut reiciendis voluptatibus maiores alias consequatur. Phasellus viverra nulla ut metus varius laoreet quisque rutrum.",
    home_game: {
      stadium_name: "Sharp Sharks Arena",
      stadium_address: "600 Sharks Ln, Smart Shore, GA 30006",
      datetime: "2026-08-14T18:00:00-04:00",
    },
  },
  {
    id: 36,
    name: "Dope H.S.",
    city: "Spruce Summit",
    state: "GA",
    region: "South",
    votes: 12117,
    description:
      "Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem lorem. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur vel. Aenean imperdiet etiam ultricies nisi vel augue curae.",
    home_game: {
      stadium_name: "Dope Dragons Field",
      stadium_address: "700 Dragons Dr, Spruce Summit, GA 30007",
      datetime: "2026-09-18T19:00:00-04:00",
    },
  },
  {
    id: 37,
    name: "Swell H.S.",
    city: "Crisp Canyon",
    state: "GA",
    region: "South",
    votes: 13785,
    description:
      "Ut enim ad minima veniam quis nostrum exercitationem ullam corporis suscipit laboriosam nisi ut aliquid ex ea commodi. Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore. Duis leo sed fringilla mauris sit amet nibh donec.",
    home_game: {
      stadium_name: "Swell Stallions Stadium",
      stadium_address: "800 Stallions Ave, Crisp Canyon, GA 30008",
      datetime: "2026-08-28T19:30:00-04:00",
    },
  },
  {
    id: 38,
    name: "Boss H.S.",
    city: "Fresh Forest",
    state: "GA",
    region: "South",
    votes: 10459,
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur. Sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum. Fusce fermentum nullam varius diam elementum bibendum porttitor.",
    home_game: {
      stadium_name: "Boss Bears Arena",
      stadium_address: "900 Bears Blvd, Fresh Forest, GA 30009",
      datetime: "2026-09-04T18:00:00-04:00",
    },
  },
  {
    id: 39,
    name: "Grand H.S.",
    city: "Prim Plains",
    state: "GA",
    region: "South",
    votes: 11890,
    description:
      "Perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti. Integer tincidunt cras dapibus vivamus elementum semper nisi.",
    home_game: {
      stadium_name: "Grand Griffins Stadium",
      stadium_address: "1000 Griffins Way, Prim Plains, GA 30010",
      datetime: "2026-09-11T19:00:00-04:00",
    },
  },
];
