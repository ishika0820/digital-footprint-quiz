
const introHeader = document.getElementById("intro-header");

const questions = [
  // ACTIVE DIGITAL FOOTPRINT
  {
    id: 1,
    type: "active",
    risk: "med",
    text: "Posted publicly on Instagram, TikTok, Snapchat, or X in the past month",
    explanation: "Public posts can be viewed, shared, or saved by people outside your intended audience."
  },
  {
    id: 2,
    type: "active",
    risk: "high",
    text: "Posted a photo or video that reveals your chapter house's address or location",
    explanation: "Photos, captions, and location tags can reveal where chapter members live or gather."
  },
  {
    id: 3,
    type: "active",
    risk: "low",
    text: "Tagged your big, little, or another sister in a photo together",
    explanation: "Tags connect online identities and relationships. Even ordinary photos contribute to your searchable digital presence."
  },
  {
    id: 4,
    type: "active",
    risk: "high",
    text: "Posted a selfie with your sisters at a bar or party and tagged the location",
    explanation: "Location tags can reveal where you and other members are, particularly when posts are shared in real time."
  },
  {
    id: 5,
    type: "active",
    risk: "high",
    text: "Shared your real-time location while attending a chapter event or social gathering",
    explanation: "Real-time location sharing can reveal your whereabouts and potentially those of other members."
  },
  {
    id: 6,
    type: "active",
    risk: "low",
    text: "Posted photos or videos from a chapter philanthropy, volunteering, or fundraising event",
    explanation: "Sharing community involvement can build a positive digital identity and highlight your chapter's contributions."
  },
  {
    id: 7,
    type: "active",
    risk: "high",
    text: "Shared details about a private chapter meeting, event, or internal discussion on a public account",
    explanation: "Publicly sharing private chapter information can expose details intended only for members."
  },
  {
    id: 8,
    type: "active",
    risk: "med",
    text: "Commented publicly under your real name on a social media post, article, or forum",
    explanation: "Public comments can remain searchable and may be associated with your identity."
  },
  {
    id: 9,
    type: "active",
    risk: "low",
    text: "Have a public LinkedIn profile showcasing your education, leadership, or professional experience",
    explanation: "A professional profile contributes to your digital footprint and can help showcase your accomplishments."
  },
  {
    id: 10,
    type: "active",
    risk: "low",
    text: "Shared your academic achievements, leadership roles, creative work, or professional accomplishments online",
    explanation: "Sharing achievements can help create a positive and intentional digital presence."
  },
  {
    id: 11,
    type: "active",
    risk: "med",
    text: "Shared your personal phone number or email address publicly, or used it to register for contests and promotional offers",
    explanation: "Sharing contact information more widely can increase unwanted contact, spam, or exposure through third-party services."
  },

  // PASSIVE DIGITAL FOOTPRINT
  {
    id: 12,
    type: "passive",
    risk: "med",
    text: "Used Google Search while signed into your Google account",
    explanation: "Search activity may be associated with your account depending on your privacy and activity settings."
  },
  {
    id: 13,
    type: "passive",
    risk: "med",
    text: "Allowed Instagram, Snapchat, TikTok, or another app to access your location",
    explanation: "Location permissions can allow apps to collect location information depending on your settings."
  },
  {
    id: 14,
    type: "passive",
    risk: "med",
    text: "Allowed an app to collect your location in the background, even when you weren't actively using it",
    explanation: "Background location access may allow apps to collect location data while you're not actively using them."
  },
  {
    id: 15,
    type: "passive",
    risk: "med",
    text: "Browsed websites while signed into a browser with syncing enabled",
    explanation: "Browser syncing may associate browsing information with your account across devices."
  },
  {
    id: 16,
    type: "passive",
    risk: "low",
    text: "Clicked 'Accept All' on cookie banners without reviewing the privacy options",
    explanation: "Some cookies support analytics, advertising, and tracking across websites."
  },
  {
    id: 17,
    type: "passive",
    risk: "med",
    text: "Allowed an app to access your contacts, camera, microphone, or photo library",
    explanation: "App permissions may provide access to personal information or device features depending on how the app uses them."
  },
  {
    id: 18,
    type: "passive",
    risk: "med",
    text: "Used a shared Google Photos, iCloud, or other cloud album to store photos from chapter events",
    explanation: "Shared albums may contain identifiable photos, location metadata, and information about members. Who can access the album matters."
  },
  {
    id: 19,
    type: "passive",
    risk: "med",
    text: "Connected third-party apps or websites to your Google, Instagram, or other social media accounts",
    explanation: "Connected services may receive account information or permissions that remain active until revoked."
  },
  {
    id: 20,
    type: "passive",
    risk: "high",
    text: "Had your personal information exposed in a known data breach",
    explanation: "Exposed information may circulate beyond the original service and could increase the risk of account compromise."
  },
  {
    id: 21,
    type: "passive",
    risk: "low",
    text: "Connected to public Wi-Fi at a coffee shop, airport, or campus without using a VPN",
    explanation: "Public Wi-Fi can expose some network information. HTTPS already encrypts most modern website traffic, while a trusted VPN can provide additional protection."
  }
];

// Store selections only in browser memory
const selectedAnswers = new Set();

const introPage = document.getElementById("intro-page");
const quizPage = document.getElementById("quiz-page");

const startButton = document.getElementById("start-btn");
const backButton = document.getElementById("back-btn");
const resultsButton = document.getElementById("results-btn");

function renderQuestions() {
  const activeContainer = document.getElementById("active-questions");
  const passiveContainer = document.getElementById("passive-questions");

  questions.forEach(question => {
    const item = document.createElement("div");
    item.className = "question-item";

    const label = document.createElement("label");
    label.className = "question-row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = selectedAnswers.has(question.id);

    const text = document.createElement("span");
    text.className = "question-text";
    text.textContent = question.text;

    const badge = document.createElement("span");
    badge.className = `risk-badge risk-${question.risk}`;
    badge.textContent = question.risk.toUpperCase();

    const explanation = document.createElement("p");
    explanation.className = "question-explanation";
    explanation.textContent = question.explanation;

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        selectedAnswers.add(question.id);
      } else {
        selectedAnswers.delete(question.id);
      }

      updateProgress();
    });

    label.append(checkbox, text, badge);
    item.append(label, explanation);

    if (question.type === "active") {
      activeContainer.appendChild(item);
    } else {
      passiveContainer.appendChild(item);
    }
  });
}

function updateProgress() {
  const selected = questions.filter(q =>
    selectedAnswers.has(q.id)
  );

  const active = selected.filter(q =>
    q.type === "active"
  ).length;

  const passive = selected.filter(q =>
    q.type === "passive"
  ).length;

  const total = selected.length;
  const percentage = (total / questions.length) * 100;

  document.getElementById("active-count").textContent = active;
  document.getElementById("passive-count").textContent = passive;

  document.getElementById("progress-fill").style.width =
    `${percentage}%`;

  document.getElementById("footprint-label").textContent =
    total === 0 ? "None yet" : `${total} of ${questions.length} items`;
}


/* PERSONALIZED RESULTS */

const resultsPage = document.getElementById("results-page");

const riskWeights = {
  low: 1,
  med: 2,
  high: 3
};


/* DIGITAL FOOTPRINT SIZE */

function calculateScore(type = null) {
  const relevantQuestions = questions.filter(q =>
    type === null || q.type === type
  );

  const selectedCount = relevantQuestions.filter(q =>
    selectedAnswers.has(q.id)
  ).length;

  return relevantQuestions.length === 0
    ? 0
    : Math.round(
        (selectedCount / relevantQuestions.length) * 100
      );
}

/* PRIVACY EXPOSURE */

// Weights are educational estimates.
// Zero means the activity is not counted as exposure.

const exposureWeights = {
  1: 1,   // Public social media
  2: 3,   // Chapter house location
  3: 0,   // Big/little photo tag
  4: 3,   // Bar/party location tag
  5: 3,   // Real-time location
  6: 0,   // Philanthropy
  7: 3,   // Private chapter details
  8: 1,   // Public comments
  9: 0,   // LinkedIn
  10: 0,  // Achievements
  11: 2,  // Contact information
  12: 1,  // Google Search
  13: 2,  // App location permission
  14: 3,  // Background location
  15: 1,  // Browser syncing
  16: 1,  // Cookies
  17: 2,  // App permissions
  18: 2,  // Shared chapter albums
  19: 2,  // Connected apps
  20: 3,  // Data breach
  21: 1   // Public Wi-Fi
};

function calculateExposure() {
  const maximumScore = Object.values(
    exposureWeights
  ).reduce((sum, weight) => sum + weight, 0);

  const selectedScore = questions.reduce(
    (sum, question) => {
      if (!selectedAnswers.has(question.id)) {
        return sum;
      }

      return sum + (exposureWeights[question.id] || 0);
    },
    0
  );

  return maximumScore === 0
    ? 0
    : Math.round(
        (selectedScore / maximumScore) * 100
      );
}

function getExposureCategory(score) {
  if (score < 34) {
    return {
      name: "Lower Exposure",
      color: "#21867e",
      description:
        "Your selected activities indicate relatively " +
        "limited potential privacy exposure within this " +
        "assessment. Continue reviewing your settings " +
        "and thinking about what you share online."
    };
  }

  if (score < 67) {
    return {
      name: "Moderate Exposure",
      color: "#b68a36",
      description:
        "Some of your online activities may reveal " +
        "personal information or allow services to " +
        "collect data about you. Consider reviewing " +
        "your privacy settings, location sharing, " +
        "and public profiles."
    };
  }

  return {
    name: "Higher Exposure",
    color: "#ba6054",
    description:
      "Several of your selected activities may expose " +
      "personal or chapter-related information. " +
      "Consider reviewing location sharing, app " +
      "permissions, and what information is publicly " +
      "accessible about you."
  };
}

function getCategory(score) {
  if (score < 34) {
    return {
      name: "Smaller Footprint",
      icon: "🌱",
      color: "#21867e",
      heading: "A Smaller Digital Trail",
      description:
        "You selected relatively few activities from " +
        "this assessment. This doesn't mean you have " +
        "no digital footprint — some information may " +
        "still be collected or shared without your " +
        "knowledge."
    };
  }

  if (score < 67) {
    return {
      name: "Moderate Footprint",
      icon: "👣",
      color: "#b68a36",
      heading: "An Active Digital Presence",
      description:
        "You participate in several activities that " +
        "contribute to your digital identity. Your " +
        "footprint can include both positive content " +
        "and information you may want to keep private."
    };
  }

  return {
    name: "Larger Footprint",
    icon: "🌐",
    color: "#ba6054",
    heading: "A Wide Digital Presence",
    description:
      "You selected many activities that contribute " +
      "to your online presence. A larger footprint " +
      "isn't automatically negative. What matters " +
      "is the information you're sharing and how " +
      "intentionally you manage it."
  };
}

function showResults() {
  const score = calculateScore();
  const activeScore = calculateScore("active");
  const passiveScore = calculateScore("passive");

  const category = getCategory(score);
  const exposureScore = calculateExposure();
  const exposure = getExposureCategory(exposureScore);

  document.getElementById("result-icon").textContent =
    category.icon;

  document.getElementById("result-category").textContent =
    category.name;

  document.getElementById("result-category").style.color =
    category.color;

  document.getElementById("result-percentage").textContent =
    score;

  document.getElementById("result-meter-fill").style.width =
    `${score}%`;

  document.getElementById("result-meter-fill").style.background =
    category.color;

  document.getElementById("result-heading").textContent =
    category.heading;

  document.getElementById("result-description").textContent =
    category.description;

  document.getElementById("active-score").textContent =
    `${activeScore}%`;

  document.getElementById("passive-score").textContent =
    `${passiveScore}%`;

  document.getElementById("active-bar").style.width =
    `${activeScore}%`;

  document.getElementById("passive-bar").style.width =
    `${passiveScore}%`;

    document.getElementById("exposure-category").textContent =
    exposure.name;

    document.getElementById("exposure-category").style.color =
    exposure.color;

    document.getElementById("exposure-percentage").textContent =
    `${exposureScore}%`;

    document.getElementById("exposure-meter-fill").style.width =
    `${exposureScore}%`;

    document.getElementById("exposure-meter-fill").style.background =
    exposure.color;

    document.getElementById("exposure-description").textContent =
    exposure.description;


  renderRecommendations();

  quizPage.hidden = true;
  resultsPage.hidden = false;

  window.scrollTo(0, 0);
}


/* PERSONALIZED RECOMMENDATIONS */


const recommendationRules = [
  {
    ids: [2, 4, 5],
    title: "Be Mindful of Location Sharing",
    description:
      "Avoid posting real-time locations or revealing private chapter locations. " +
      "Review location tags before sharing photos from chapter events or social gatherings."
  },
  {
    ids: [1, 3, 8],
    title: "Review Your Public Social Media Presence",
    description:
      "Check who can see your posts, tags, and comments. " +
      "Remember that public content can be saved or shared beyond your intended audience."
  },
  {
    ids: [7],
    title: "Protect Private Chapter Information",
    description:
      "Keep internal chapter discussions, meeting details, and private event information " +
      "within approved communication channels."
  },
  {
    ids: [6, 9, 10],
    title: "Keep Building a Positive Digital Identity",
    description:
      "Your online presence can showcase philanthropy, leadership, academic achievements, " +
      "and professional skills. Continue sharing intentionally."
  },
  {
    ids: [11],
    title: "Protect Your Contact Information",
    description:
      "Review where your email address and phone number are publicly visible. " +
      "Consider using a separate email address for promotional sign-ups."
  },
  {
    ids: [12, 15, 16],
    title: "Review Your Browsing Privacy",
    description:
      "Check your Google activity controls, browser syncing settings, " +
      "and cookie preferences to understand what information is collected."
  },
  {
    ids: [13, 14, 17],
    title: "Manage App Permissions",
    description:
      "Review which apps can access your location, contacts, camera, microphone, " +
      "and photos. Disable permissions you don't need."
  },
  {
    ids: [18],
    title: "Check Shared Chapter Albums",
    description:
      "Review who has access to shared photo albums. " +
      "Avoid sharing private links publicly and check whether photos reveal sensitive information."
  },
  {
    ids: [19],
    title: "Review Connected Accounts",
    description:
      "Check which third-party apps are connected to your accounts " +
      "and remove access for services you no longer use."
  },
  {
    ids: [20],
    title: "Secure Your Accounts",
    description:
      "If your information was exposed in a breach, update affected passwords, " +
      "avoid password reuse, and enable multi-factor authentication."
  },
  {
    ids: [21],
    title: "Use Public Wi-Fi Thoughtfully",
    description:
      "Prefer HTTPS websites, keep your device updated, and avoid unfamiliar networks. " +
      "A trusted VPN can offer additional privacy on public Wi-Fi."
  }
];

function renderRecommendations() {
  const container = document.getElementById(
    "recommendations-list"
  );

  container.replaceChildren();

  const matchedRules = recommendationRules.filter(rule =>
    rule.ids.some(id => selectedAnswers.has(id))
  );

  // Show up to four relevant suggestions.
  const suggestions = matchedRules
    .map(rule => ({
        ...rule,
        matches: rule.ids.filter(id =>
        selectedAnswers.has(id)
        ).length,
        highestRisk: Math.max(
        ...rule.ids
            .filter(id => selectedAnswers.has(id))
            .map(id => {
            const question = questions.find(q => q.id === id);
            return riskWeights[question.risk];
            })
        )
    }))
    .sort((a, b) =>
        b.highestRisk - a.highestRisk ||
        b.matches - a.matches
    )
    .slice(0, 4);

  if (suggestions.length === 0) {
    suggestions.push({
      title: "Keep Reviewing Your Digital Presence",
      description:
        "Even if you selected few activities, " +
        "periodically review your privacy settings, " +
        "public profiles, and connected accounts."
    });
  }

  suggestions.forEach(rule => {
    const card = document.createElement("div");
    card.className = "recommendation-card";

    const heading = document.createElement("h4");
    heading.textContent = rule.title;

    const description = document.createElement("p");
    description.textContent = rule.description;

    card.append(heading, description);
    container.appendChild(card);
  });
}

// Page navigation

startButton.addEventListener("click", () => {
  introHeader.hidden = true;
  introPage.hidden = true;
  quizPage.hidden = false;
  window.scrollTo(0, 0);
});

backButton.addEventListener("click", () => {
  quizPage.hidden = true;
  introHeader.hidden = false;
  introPage.hidden = false;
  window.scrollTo(0, 0);
});


/* RESULTS NAVIGATION */

const editAnswersButton = document.getElementById(
  "edit-answers-btn"
);

const retakeButton = document.getElementById("retake-btn");

resultsButton.addEventListener("click", showResults);

editAnswersButton.addEventListener("click", () => {
  resultsPage.hidden = true;
  quizPage.hidden = false;
  window.scrollTo(0, 0);
});

retakeButton.addEventListener("click", () => {
  selectedAnswers.clear();

  document.querySelectorAll(
    "#quiz-page input[type='checkbox']"
  ).forEach(checkbox => {
    checkbox.checked = false;
  });

  updateProgress();

  resultsPage.hidden = true;
  introHeader.hidden = false;
  introPage.hidden = false;

  window.scrollTo(0, 0);
});

document.getElementById("logout-btn")
  .addEventListener("click", async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
      credentials: "same-origin"
    });

    if (response.ok) {
      window.location.replace("/login");
    } else {
      alert("Could not sign out. Please try again.");
    }
  });

// Initialize questionnaire
renderQuestions();
updateProgress();