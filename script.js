
const introHeader = document.getElementById("intro-header");
const questions = [
  // ACTIVE FOOTPRINT
  {
    id: 1,
    type: "active",
    risk: "med",
    text: "Posted publicly on Instagram, TikTok, or X in the past month",
    explanation: "Public posts can be viewed, shared, or saved by people outside your intended audience."
  },
  {
    id: 2,
    type: "active",
    risk: "low",
    text: "Left a public review on Google, Yelp, or Amazon",
    explanation: "Reviews may remain searchable and can sometimes be connected to your public profile."
  },
  {
    id: 3,
    type: "active",
    risk: "med",
    text: "Commented under your real name on a public post, article, or forum",
    explanation: "Public comments can appear in searches and may be associated with your identity."
  },
  {
    id: 4,
    type: "active",
    risk: "high",
    text: "Posted photos or stories revealing your location or daily routine",
    explanation: "Location and routine information may reveal where you live, study, or spend time."
  },
  {
    id: 5,
    type: "active",
    risk: "med",
    text: "Shared personal opinions on controversial topics publicly",
    explanation: "Public opinions can reach audiences beyond the people you originally intended."
  },
  {
    id: 6,
    type: "active",
    risk: "low",
    text: "Have a public LinkedIn profile with your education and work history",
    explanation: "Professional profiles create a discoverable footprint, but can also support your career."
  },
  {
    id: 7,
    type: "active",
    risk: "med",
    text: "Tagged or been tagged in photos where your face is clearly visible",
    explanation: "Other people's posts may reveal information about you even when you did not publish them."
  },
  {
    id: 8,
    type: "active",
    risk: "low",
    text: "Signed up for newsletters, contests, or free trials using your real email",
    explanation: "Email addresses may be shared with service providers or exposed through data breaches."
  },
  {
    id: 9,
    type: "active",
    risk: "med",
    text: "Used your real name or photo on a dating app",
    explanation: "Identifiable profiles can sometimes be captured or shared outside the app."
  },
  {
    id: 10,
    type: "active",
    risk: "med",
    text: "Shared your phone number publicly or used it for non-essential services",
    explanation: "Wider distribution of your phone number can increase unwanted contact or spam."
  },

  // PASSIVE FOOTPRINT
  {
    id: 11,
    type: "passive",
    risk: "med",
    text: "Used Google Search while logged into a Google account",
    explanation: "Search activity may be associated with your account depending on your settings."
  },
  {
    id: 12,
    type: "passive",
    risk: "med",
    text: "Used a loyalty or rewards card at a store",
    explanation: "Loyalty programs may collect information about your purchases and shopping habits."
  },
  {
    id: 13,
    type: "passive",
    risk: "med",
    text: "Allowed a mobile app to access your location, contacts, or camera",
    explanation: "App permissions can allow access to sensitive information or device features."
  },
  {
    id: 14,
    type: "passive",
    risk: "med",
    text: "Browsed websites while signed into a browser with sync enabled",
    explanation: "Browser sync can associate certain browsing information with your account."
  },
  {
    id: 15,
    type: "passive",
    risk: "low",
    text: "Used a smart speaker such as Alexa, Google Home, or Siri regularly",
    explanation: "Voice assistants may process interactions and retain some activity depending on settings."
  },
  {
    id: 16,
    type: "passive",
    risk: "med",
    text: "Had your information exposed in a known data breach",
    explanation: "Breached information may circulate beyond the service where it was originally collected."
  },
  {
    id: 17,
    type: "passive",
    risk: "med",
    text: "Used public Wi-Fi without a VPN in the past month",
    explanation: "Public networks may expose some connection information. HTTPS helps protect website traffic."
  },
  {
    id: 18,
    type: "passive",
    risk: "low",
    text: "Clicked 'Accept All' on cookie banners without reviewing the options",
    explanation: "Some cookies support advertising, analytics, and tracking across websites."
  },
  {
    id: 19,
    type: "passive",
    risk: "low",
    text: "Automatically synced photos to iCloud or Google Photos",
    explanation: "Cloud photo services may store photos and associated metadata in your account."
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
    total === 0 ? "None yet" : `${total} of 19 items`;
}


/* PERSONALIZED RESULTS */

const resultsPage = document.getElementById("results-page");

const riskWeights = {
  low: 1,
  med: 2,
  high: 3
};

function calculateScore(type = null) {
  const relevantQuestions = questions.filter(q =>
    type === null || q.type === type
  );

  const maximumScore = relevantQuestions.reduce(
    (sum, q) => sum + riskWeights[q.risk], 0
  );

  const earnedScore = relevantQuestions.reduce(
    (sum, q) =>
      sum + (selectedAnswers.has(q.id)
        ? riskWeights[q.risk]
        : 0),
    0
  );

  return maximumScore === 0
    ? 0
    : Math.round((earnedScore / maximumScore) * 100);
}

function getCategory(score) {
  if (score < 34) {
    return {
      name: "Small Footprint",
      icon: "🌱",
      color: "#21867e",
      heading: "A Smaller Visible Trail",
      description:
        "You selected relatively few of the activities " +
        "listed in this assessment. This may mean you " +
        "share less information through these activities, " +
        "but it doesn't mean your online presence is " +
        "invisible. Websites and services may still " +
        "collect information about you."
    };
  }

  if (score < 67) {
    return {
      name: "Moderate Footprint",
      icon: "👣",
      color: "#b68a36",
      heading: "An Active Digital Presence",
      description:
        "Your answers suggest a mix of online activities " +
        "that contribute to your digital footprint. " +
        "Some may help you connect, learn, and build " +
        "opportunities. Reviewing what you share " +
        "and your privacy settings can help you " +
        "make more informed choices."
    };
  }

  return {
    name: "Large Footprint",
    icon: "🌐",
    color: "#ba6054",
    heading: "A Wide Digital Trail",
    description:
      "You selected many activities that contribute " +
      "to your digital presence. A larger footprint " +
      "isn't automatically negative — it can include " +
      "valuable professional and creative activity. " +
      "However, it's worth reviewing which information " +
      "is publicly visible and which services collect " +
      "your data."
  };
}

function showResults() {
  const score = calculateScore();
  const activeScore = calculateScore("active");
  const passiveScore = calculateScore("passive");

  const category = getCategory(score);

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

  renderRecommendations();

  quizPage.hidden = true;
  resultsPage.hidden = false;

  window.scrollTo(0, 0);
}


/* PERSONALIZED RECOMMENDATIONS */

const recommendationRules = [
  {
    ids: [4, 13],
    title: "Review Your Location Settings",
    description:
      "Check which apps can access your location. " +
      "Consider using 'While Using the App' permissions " +
      "and avoid sharing your live location publicly."
  },
  {
    ids: [1, 3, 5, 7],
    title: "Review Your Public Online Presence",
    description:
      "Look at your public profiles, posts, and comments. " +
      "Check your audience settings and consider what " +
      "a stranger or future employer could see."
  },
  {
    ids: [8, 10],
    title: "Protect Your Contact Information",
    description:
      "Avoid sharing your phone number publicly. " +
      "Consider using a separate email address " +
      "for newsletters and promotional sign-ups."
  },
  {
    ids: [11, 14, 18],
    title: "Manage Your Browsing Privacy",
    description:
      "Review browser privacy settings, account " +
      "activity controls, and cookie preferences. " +
      "You can often limit optional tracking."
  },
  {
    ids: [13, 15, 19],
    title: "Check Your App and Cloud Settings",
    description:
      "Review app permissions, voice assistant " +
      "activity controls, and cloud photo-sharing " +
      "settings to understand what is stored."
  },
  {
    ids: [16],
    title: "Secure Your Online Accounts",
    description:
      "If your information appeared in a data breach, " +
      "change affected passwords, avoid password reuse, " +
      "and enable multi-factor authentication."
  },
  {
    ids: [17],
    title: "Use Public Wi-Fi Thoughtfully",
    description:
      "Prefer HTTPS websites, keep your devices " +
      "updated, and avoid joining unfamiliar networks."
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
  const suggestions = matchedRules.slice(0, 4);

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