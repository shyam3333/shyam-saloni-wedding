/* =========================================================================
   WEDDING INVITATION - CONTENT CONFIG
   -------------------------------------------------------------------------
   Edit everything in this ONE file to change what the site shows.
   No HTML/CSS knowledge needed for basic edits - just replace the text
   between the quotes. Save the file and refresh the browser to see changes.

   NOTES:
   - This is placeholder/sample content (same style as the reference video)
     so you can see the whole site working first.
   - Dates use the format "YYYY-MM-DDTHH:MM:SS" (24-hour clock) for
     `weddingDate` because the countdown timer needs to parse it. Everything
     else is just plain display text and can be written however you like.
   - Set an image path (e.g. "assets/images/venue.jpg") on any `img` field
     once you have a real photo. Leave it as null to keep the elegant
     decorative placeholder.
   ========================================================================= */

window.WEDDING_CONFIG = {

  // ---- Couple -------------------------------------------------------
  couple: {
    groom: "Shyam",
    bride: "Saloni",
    groomFull: "Er. Shyam",
    brideFull: "Ms. Saloni",
    monogram: "S & S"
  },

  // ---- Families -------------------------------------------------------
  families: {
    groomFamilyName: "Varshney",
    brideFamilyName: "Varshney",
    groomParents: "Mrs. Rekha Rani & Er. Sanjeev Kumar Varshney",
    groomGrandparents: "Late Smt. Laxmi Devi & Late Shri Ram Krishna Varshney (BDO)",
    brideParents: "Mrs. Ritu Gupta & Mr. Shri Mohan Varshney",
    brideGrandparents: "Late Smt. Anara Devi & Late Shri Jagdish Prasad Gupta"
  },

  // ---- Cover / intro text --------------------------------------------
  coverInviteLine: "The Varshney family invite you to celebrate the auspicious wedding of Shyam and Saloni.",

  // ---- Logo used on the cover seal (transparent PNG) --------------------
  logo: {
    src: "assets/images/logo.png"
  },

  // ---- Dates ------------------------------------------------------------
  // weddingDate MUST stay in this exact format - it drives the countdown.
  weddingDate: "2026-11-26T19:00:00",
  weddingDateDisplay: "Thursday · 26th November 2026",
  weddingDateShort: "26th November, 2026",
  tagline: "The start of a beautiful journey, shared with the ones we love most.",

  // ---- Gallery ("Our Beautiful Moments") --------------------------------
  // Add up to as many as you like. Set img to a path once you have photos.
  gallery: [
    { caption: "Where It All Begin", img: "assets/images/gallery/begin.jpg" },
    { caption: "The Proposal", img: "assets/images/gallery/proposal.jpg" },
    { caption: "Our First Celebration Together", img: "assets/images/gallery/celebration.jpg" },
    { caption: "Forever Begins Here", img: "assets/images/gallery/forever.jpg" }
  ],

  // ---- Venue -------------------------------------------------------------
  // mapQuery: precise "lat,lng" used to pin the embedded map (falls back to
  // `address` if left empty). directionsUrl: the exact Google Maps place
  // link, used by "Get Directions" (falls back to a search on `address`).
  venue: {
    name: "Madhogarh, Jaipur",
    address: "Grand Sikar Road, Before Rajawas Pulia, Jaipur, Rajasthan – 302048",
    mapQuery: "27.0540141,75.754726",
    directionsUrl: "https://www.google.com/maps/place/Madhogarh/@27.0540141,75.7521511,17z/data=!4m9!3m8!1s0x396dad4860958c3d:0xf1d95c6356ddb17d!5m2!4m1!1i2!8m2!3d27.0540141!4d75.754726!16s%2Fg%2F11rhsvg8yj!5m1!1e1",
    img: null
  },

  // ---- Ceremonies ("Sacred Ceremonies") ---------------------------------
  // icon must be one of: haldiCarnival, sangeetDark, pheras, baratReception
  // theme must be one of: lavender, dark, fire, royal, blush (only affects
  // the theme badge's color if you add a themeLabel; the photo IS the card)
  //
  // bgImage: the real photo used as this card's full background.
  // darkText: set true when the photo's open space is LIGHT (so the text
  //   needs dark ink) - leave it off for a dark/night photo like Sangeet's,
  //   which shows white text instead.
  // boldText: extra-bold schedule text (used for Musical Pheras & Barat on
  //   Wheels/Reception, whose photos need stronger contrast).
  // textTop: where the text block starts, as a % down the card - tune this
  //   per photo so the text lands in its open/empty space.
  // venue: a short venue label shown on the card (plain text, no map).
  // venueMap: instead of a plain venue label, show the venue name PLUS an
  //   embedded map + "Get Directions" button (like the main venue section)
  //   in a panel below the photo. { mapQuery: "lat,lng", directionsUrl }
  // schedule: optional list of {label, time} sub-events under a single
  //   date, shown instead of one time line (Musical Pheras, Barat/Reception).
  // scheduleGroups: optional list of {date, items: [{label,time}]} for a
  //   ceremony that spans several dates (Manglik Programme) - rendered in
  //   a panel below the photo, alongside the venue/map.
  ceremonies: [
    {
      icon: "manglik",
      theme: "blush",
      name: "Manglik Programme",
      bgImage: "assets/images/ceremonies/manglik-bg.jpg",
      darkText: true,
      textTop: "24%",
      venue: "Home",
      venueMap: {
        mapQuery: "26.9234102,75.7480169",
        directionsUrl: "https://www.google.com/maps/place/Lakshmi+Nivas/@26.923415,75.745442,17z/data=!3m1!4b1!4m6!3m5!1s0x396db3653a8523f5:0x66a0c32adcf82866!8m2!3d26.9234102!4d75.7480169!16s%2Fg%2F11b7ttklgn!5m1!1e1"
      },
      scheduleGroups: [
        {
          date: "22 November 2026",
          items: [
            { label: "Gehu Kirana", time: "11:00 AM" },
            { label: "Peedi Bandhna", time: "3:00 PM" },
            { label: "Ratjaga", time: "10:30 PM" }
          ]
        },
        {
          date: "23 November 2026",
          items: [
            { label: "Ghar ki Haldi", time: "11:00 AM" },
            { label: "Mehndi", time: "6:00 PM" }
          ]
        },
        {
          date: "24 November 2026",
          items: [
            { label: "Bhaat (Groom)", time: "3:30 PM" },
            { label: "Ghudchari", time: "7:30 PM" }
          ]
        }
      ]
    },
    {
      icon: "haldiCarnival",
      theme: "lavender",
      name: "Haldi Carnival",
      subtitle: "Colorful Fiesta",
      date: "25th November 2026",
      time: "1:30 PM onwards",
      themeLabel: "Shades Of Lavender",
      venue: "Madhogarh",
      bgImage: "assets/images/ceremonies/haldi-carnival-bg.jpg",
      darkText: true,
      textTop: "19%"
    },
    {
      icon: "sangeetDark",
      theme: "dark",
      name: "Engagement & Sangeet with Celebration & Dinner",
      subtitle: "Sip, Sparkle & Say ‘Yes’",
      date: "25th November 2026",
      time: "5:30 PM onwards",
      themeLabel: "Glam and Glitter",
      venue: "Madhogarh",
      bgImage: "assets/images/ceremonies/sangeet-bg.jpg",
      textTop: "23%"
    },
    {
      icon: "pheras",
      theme: "fire",
      name: "Musical Pheras",
      subtitle: "Sacred Vows Of Forever",
      date: "26th November 2026",
      themeLabel: "",
      venue: "Madhogarh",
      bgImage: "assets/images/ceremonies/pheras-bg.jpg",
      darkText: true,
      boldText: true,
      textTop: "24%",
      schedule: [
        { label: "Bhaat (Bride)", time: "11:00 AM" },
        { label: "Sagai And Aagoni", time: "1:30 PM" },
        { label: "Musical Pheras", time: "3:30 PM" }
      ]
    },
    {
      icon: "baratReception",
      theme: "royal",
      name: "Barat on Wheels & Reception",
      subtitle: "Happily Ever After Party",
      date: "26th November 2026",
      themeLabel: "",
      venue: "Madhogarh",
      bgImage: "assets/images/ceremonies/barat-reception-bg.jpg",
      darkText: true,
      boldText: true,
      textTop: "34%",
      schedule: [
        { label: "Barat", time: "7:30 PM" },
        { label: "Dinner", time: "8:00 PM onwards" },
        { label: "Varmala", time: "9:30 PM" }
      ]
    },
    {
      icon: "baratReception",
      theme: "blush",
      name: "Vidai",
      subtitle: "From celebration to farewell, wrapped in love and tears",
      subtitleMaxWidth: "72%",
      date: "November 27, 2026",
      time: "Early Morning",
      venue: "Madhogarh",
      bgImage: "assets/images/ceremonies/bheegi-palkein-bg.jpg",
      darkText: true,
      textTop: "30%"
    },
    {
      icon: "pheras",
      theme: "royal",
      name: "Shree Khatu Shyam Bhajan",
      date: "November 27, 2026",
      themeLabel: "",
      venue: "Home",
      bgImage: "assets/images/ceremonies/khatu-shyam-bhajan-bg.jpg",
      darkText: true,
      compactText: true,
      titleMaxWidth: "66%",
      textTop: "26%",
      deityPhoto: "assets/images/khatushyam.png",
      schedule: [
        { label: "Bhajan Sandhya", time: "5:00 PM onwards" },
        { label: "Dinner", time: "8:00 PM onwards" }
      ]
    }
  ],

  // ---- Background music -----------------------------------------------
  // Drop a royalty-free mp3 at assets/audio/music.mp3 (see the README in
  // that folder for free/legal sources). The toggle button works fine even
  // before the file exists - it just won't produce sound yet.
  audio: {
    src: "assets/audio/music.mp3"
  },

  // ---- Footer ---------------------------------------------------------
  footer: {
    // shown as its own block at the very start of the footer, above R.S.V.P.
    childRequest: {
      title: "Child Request",
      message: "Haldi Hai Chandan Hai, Rishto Ka Bandhan Hai, Mere Mama/Chacha Ki Shadi Mein Aap Sab Ka Abhinandan Hai...",
      names: "Akshaj, Arnav, Suhrid, Shubhangi, Swastik, Vidhaan, Durvi, Advika, Madhav, Anahat, Som"
    },
    rsvp: {
      title: "R.S.V.P.",
      names: [
        "Dr. Anil Kumar Varshney & Smt. Manju Varshney",
        "Er. Sunil Kumar Gupta & Smt. Santosh Gupta",
        "Dr. Sandeep Kumar & Smt. Navita Rani"
      ],
      mobiles: ["8368927006", "9425382298", "9448309554"]
    },
    awaitingEyes: {
      title: "Awaiting Eyes",
      names: [
        "Er. Gaurav Varshney & Er. Khushboo Varshney",
        "Er. Sukrat Gupta & Er. Sonia Varshney",
        "Er. Vikas Varshney & Dr. Aditi Varshney",
        "Er. Navdeep Kumar & Er. Shivani Varshney",
        "Er. Abhishek Varshney & Er. Swati Gupta",
        "Er. Sudeep Kumar & Er. Swati Varshney",
        "Er. Ayush Varshney & Er. Juhi Varshney"
      ]
    },
    compliments: {
      title: "With Best Compliments From",
      lines: [
        "Sh. Narendra Kumar Gupta,",
        "Prempal, Yashpal, Rakesh,",
        "Rajeev Krishna, Prabhat Krishna,",
        "All Varshney Parivar & Krishna Parivar"
      ]
    },
    invitation: {
      title: "A Cordial Invitation From",
      name: "Er. Sanjeev Kumar (Ex. General Manager- REIL) & Mrs. Rekha Rani",
      address: [
        "Laxmi Niwas, 7, Mitra Colony, Khatipura Mod, Khatipura,",
        "Jaipur, Rajasthan - 302012"
      ],
      mobiles: ["9829747744", "8769775976"]
    }
  }
};
