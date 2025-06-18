"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BookOpen, PencilRuler, GraduationCap, Library, Trophy, Users, Lightbulb, Brain } from "lucide-react"

const UPGRADES = [
  {
    id: "study_skills",
    name: "Study Skills",
    description: "Improve your ability to learn and retain information",
    basePrice: 15,
    priceMultiplier: 1.5,
    effect: 1,
    maxLevel: 50,
    icon: <BookOpen className="h-4 w-4 mr-1" />,
  },
  {
    id: "school_supplies",
    name: "School Supplies",
    description: "Get better tools for studying and note-taking",
    basePrice: 30,
    priceMultiplier: 1.7,
    effect: 0.5,
    maxLevel: 50,
    icon: <PencilRuler className="h-4 w-4 mr-1" />,
  },
  {
    id: "library_access",
    name: "Library Access",
    description: "Gain access to more books and resources",
    basePrice: 100,
    priceMultiplier: 1.8,
    effect: 3,
    maxLevel: 30,
    icon: <Library className="h-4 w-4 mr-1" />,
  },
  {
    id: "tutoring",
    name: "Tutoring",
    description: "Get help from tutors to improve your grades",
    basePrice: 250,
    priceMultiplier: 2.0,
    effect: 5,
    maxLevel: 20,
    icon: <Users className="h-4 w-4 mr-1" />,
  },
]

// Προχωρημένα upgrades
const ADVANCED_UPGRADES = [
  {
    id: "advanced_courses",
    name: "Advanced Courses",
    description: "Enroll in advanced courses for higher learning",
    basePrice: 2000,
    priceMultiplier: 2.2,
    effect: 0.2, // 20% αύξηση στο study_skills
    maxLevel: 10,
    icon: <GraduationCap className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "study_skills", level: 10 } as const,
  },
  {
    id: "study_group",
    name: "Study Group",
    description: "Form a study group to learn collaboratively",
    basePrice: 5000,
    priceMultiplier: 2.3,
    effect: 0.3, // 30% αύξηση στο school_supplies
    maxLevel: 5,
    icon: <Users className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "school_supplies", level: 15 } as const,
  },
  {
    id: "research_project",
    name: "Research Project",
    description: "Conduct research projects for extra credit",
    basePrice: 10000,
    priceMultiplier: 2.5,
    effect: 0.4, // 40% αύξηση στο library_access
    maxLevel: 3,
    icon: <Lightbulb className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "library_access", level: 15 } as const,
  },
  {
    id: "academic_competition",
    name: "Academic Competition",
    description: "Participate in academic competitions for recognition",
    basePrice: 25000,
    priceMultiplier: 3.0,
    effect: 0.5, // 50% αύξηση στο tutoring
    maxLevel: 3,
    icon: <Trophy className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "tutoring", level: 10 } as const,
  },
  {
    id: "genius_level",
    name: "Genius Level",
    description: "Achieve genius-level understanding of all subjects",
    basePrice: 50000,
    priceMultiplier: 3.5,
    effect: 1.0, // Διπλασιασμός όλων των αποδόσεων
    maxLevel: 1,
    icon: <Brain className="h-4 w-4 mr-1" />,
    unlockRequirement: { id: "tutoring", level: 15 } as const,
  },
]

// Διαφορετικά μαθήματα
const SUBJECTS = [
  { emoji: "📝", name: "Language", value: 1 },
  { emoji: "🔢", name: "Math", value: 2 },
  { emoji: "🧪", name: "Science", value: 3 },
  { emoji: "🌍", name: "History", value: 4 },
  { emoji: "🎨", name: "Art", value: 5 },
  { emoji: "🎵", name: "Music", value: 6 },
  { emoji: "💻", name: "Computer", value: 7 },
  { emoji: "🏃", name: "P.E.", value: 8 },
  { emoji: "🧠", name: "Psychology", value: 9 },
  { emoji: "🔭", name: "Astronomy", value: 10 },
  { emoji: "🧬", name: "Biology", value: 11 },
  { emoji: "🧮", name: "Economics", value: 12 },
]

// Διαφορετικά μηνύματα για τα εφέ κλικ
const STUDY_MESSAGES = [
  "📚 Knowledge gained!",
  "✏️ Notes taken!",
  "💡 Concept understood!",
  "🧠 Memory improved!",
  "📝 Homework completed!",
  "🔍 Research done!",
  "📊 Problem solved!",
  "📖 Chapter finished!",
  "🎯 Goal achieved!",
  "🏆 Top marks!",
]

// Βαθμοί και απαιτούμενοι πόντοι
const GRADES = [
  { name: "F", threshold: 0 },
  { name: "D", threshold: 100 },
  { name: "C", threshold: 500 },
  { name: "B", threshold: 2000 },
  { name: "A", threshold: 5000 },
  { name: "A+", threshold: 10000 },
  { name: "Honor Roll", threshold: 25000 },
  { name: "Dean's List", threshold: 50000 },
  { name: "Summa Cum Laude", threshold: 100000 },
  { name: "Valedictorian", threshold: 250000 },
]

const formatPoints = (amount: number) => {
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(2)}T`
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`
  if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`
  return `${Math.floor(amount)}`
}

const SchoolClicker = () => {
  const [points, setPoints] = useState(0)
  const [studySkills, setStudySkills] = useState(1)
  const [schoolSupplies, setSchoolSupplies] = useState(0)
  const [libraryAccess, setLibraryAccess] = useState(1)
  const [tutoring, setTutoring] = useState(1)
  const [upgrades, setUpgrades] = useState<Record<string, number>>({})
  const [clickEffects, setClickEffects] = useState<
    Array<{ id: number; x: number; y: number; text: string; subject: string }>
  >([])
  const [subjectsLearned, setSubjectsLearned] = useState<Record<string, number>>({})
  const [availableSubjects, setAvailableSubjects] = useState(4) // Αρχικά διαθέσιμα μαθήματα
  const [studyStreak, setStudyStreak] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [offlineMessage, setOfflineMessage] = useState<{ message: string; amount: number } | null>(null)
  const [upgradesPage, setUpgradesPage] = useState(1) // 1 για Basic, 2 για Advanced

  // Φόρτωση της προόδου από το localStorage και υπολογισμός offline προόδου
  useEffect(() => {
    const savedProgress = localStorage.getItem("school-clicker-progress")
    if (savedProgress) {
      try {
        const {
          points: savedPoints,
          studySkills: savedStudySkills,
          schoolSupplies: savedSchoolSupplies,
          libraryAccess: savedLibraryAccess,
          tutoring: savedTutoring,
          upgrades: savedUpgrades,
          subjectsLearned: savedSubjectsLearned,
          availableSubjects: savedAvailableSubjects,
          lastUpdate,
        } = JSON.parse(savedProgress)

        setStudySkills(savedStudySkills || 1)
        setSchoolSupplies(savedSchoolSupplies || 0)
        setLibraryAccess(savedLibraryAccess || 1)
        setTutoring(savedTutoring || 1)
        setUpgrades(savedUpgrades || {})
        setSubjectsLearned(savedSubjectsLearned || {})
        setAvailableSubjects(savedAvailableSubjects || 4)

        // Υπολογισμός offline προόδου
        const now = Date.now()
        const timeDiff = now - (lastUpdate || now)
        if (timeDiff > 0 && savedSchoolSupplies > 0) {
          // Υπολογισμός πόντων που κερδήθηκαν offline (σε δευτερόλεπτα)
          // Χρησιμοποιούμε έναν μέσο πολλαπλασιαστή 1.0 για την offline πρόοδο
          const offlinePoints = (timeDiff / 1000) * (savedSchoolSupplies * savedLibraryAccess * savedTutoring * 1.0)
          setPoints((savedPoints || 0) + offlinePoints)

          // Εμφάνιση μηνύματος για τους πόντους που κερδήθηκαν offline
          if (offlinePoints > 0) {
            setOfflineMessage({
              message: `While you were away, your study materials generated`,
              amount: offlinePoints,
            })
          }
        } else {
          setPoints(savedPoints || 0)
        }
      } catch (error) {
        console.error("Error loading saved progress:", error)
      }
    }
  }, [])

  // Αποθήκευση της προόδου στο localStorage όταν αλλάζουν τα σχετικά states
  useEffect(() => {
    const progress = {
      points,
      studySkills,
      schoolSupplies,
      libraryAccess,
      tutoring,
      upgrades,
      subjectsLearned,
      availableSubjects,
      lastUpdate: Date.now(),
    }
    localStorage.setItem("school-clicker-progress", JSON.stringify(progress))
  }, [points, studySkills, schoolSupplies, libraryAccess, tutoring, upgrades, subjectsLearned, availableSubjects])

  const handleClick = useCallback(() => {
    const now = Date.now()

    // Έλεγχος για streak (κλικ μέσα σε 2 δευτερόλεπτα)
    if (now - lastClickTime < 2000) {
      setStudyStreak((prev) => Math.min(prev + 1, 5))
    } else {
      setStudyStreak(1)
    }
    setLastClickTime(now)

    // Υπολογισμός πόντων με βάση τις αναβαθμίσεις και το streak
    const streakBonus = studyStreak * 0.2 // 20% επιπλέον ανά streak
    const baseValue = studySkills * libraryAccess * tutoring
    const totalValue = baseValue * (1 + streakBonus)

    setPoints((prevPoints) => prevPoints + totalValue)

    // Προσθήκη τυχαίου μαθήματος στη συλλογή
    const availableSubjectTypes = Math.min(availableSubjects, SUBJECTS.length)
    const randomSubject = SUBJECTS[Math.floor(Math.random() * availableSubjectTypes)]

    setSubjectsLearned((prev) => ({
      ...prev,
      [randomSubject.name]: (prev[randomSubject.name] || 0) + 0.1, // Προσθέτουμε μέρος ενός μαθήματος με κάθε κλικ
    }))

    // Add click effect
    const id = Date.now()
    const x = Math.random() * 80 + 10 // Random position between 10% and 90%
    const y = Math.random() * 80 + 10

    // Select random message
    const messageIndex = Math.floor(Math.random() * STUDY_MESSAGES.length)

    setClickEffects((prev) => {
      // Limit the number of effects to 5 at any time
      if (prev.length >= 5) return prev

      return [
        ...prev,
        {
          id,
          x,
          y,
          text: STUDY_MESSAGES[messageIndex],
          subject: randomSubject.emoji,
        },
      ].slice(-5)
    })

    // Αφαίρεση εφέ μετά από το animation
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((effect) => effect.id !== id))
    }, 1000)
  }, [studySkills, libraryAccess, tutoring, studyStreak, lastClickTime, availableSubjects])

  const buyUpgrade = useCallback(
    (upgradeId: string, isAdvanced = false) => {
      const upgradesList = isAdvanced ? ADVANCED_UPGRADES : UPGRADES
      const upgrade = upgradesList.find((u) => u.id === upgradeId)
      if (!upgrade) return

      const currentLevel = upgrades[upgradeId] || 0
      const cost = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentLevel))

      // Έλεγχος αν το upgrade είναι ξεκλειδωμένο (μόνο για προχωρημένα)
      if (isAdvanced) {
        const advancedUpgrade = upgrade as (typeof ADVANCED_UPGRADES)[0]
        if (advancedUpgrade.unlockRequirement) {
          const reqId = advancedUpgrade.unlockRequirement.id
          const reqLevel = advancedUpgrade.unlockRequirement.level
          const currentReqLevel = upgrades[reqId] || 0
          if (currentReqLevel < reqLevel) {
            return // Δεν έχει ξεκλειδωθεί ακόμα
          }
        }
      }

      if (points >= cost) {
        setPoints((prevPoints) => prevPoints - cost)

        setUpgrades((prevUpgrades) => ({
          ...prevUpgrades,
          [upgradeId]: (prevUpgrades[upgradeId] || 0) + 1,
        }))

        // Εφαρμογή των επιδράσεων των βασικών upgrades
        if (!isAdvanced) {
          if (upgradeId === "study_skills") {
            setStudySkills((prev) => prev + upgrade.effect)
          } else if (upgradeId === "school_supplies") {
            setSchoolSupplies((prev) => prev + upgrade.effect)
          } else if (upgradeId === "library_access") {
            setLibraryAccess((prev) => prev + upgrade.effect)
            // Αύξηση των διαθέσιμων μαθημάτων με κάθε αναβάθμιση library_access
            setAvailableSubjects((prev) => Math.min(prev + 1, SUBJECTS.length))
          } else if (upgradeId === "tutoring") {
            setTutoring((prev) => prev + upgrade.effect)
          }
        }
        // Εφαρμογή των επιδράσεων των προχωρημένων upgrades
        else {
          if (upgradeId === "advanced_courses") {
            setStudySkills((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "study_group") {
            setSchoolSupplies((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "research_project") {
            setLibraryAccess((prev) => prev * (1 + upgrade.effect))
            setAvailableSubjects((prev) => Math.min(prev + 2, SUBJECTS.length))
          } else if (upgradeId === "academic_competition") {
            setTutoring((prev) => prev * (1 + upgrade.effect))
          } else if (upgradeId === "genius_level") {
            // Διπλασιασμός όλων
            setStudySkills((prev) => prev * 2)
            setSchoolSupplies((prev) => prev * 2)
            setLibraryAccess((prev) => prev * 2)
            setTutoring((prev) => prev * 2)
            setAvailableSubjects(SUBJECTS.length) // Ξεκλείδωμα όλων των μαθημάτων
          }
        }
      }
    },
    [points, upgrades],
  )

  // Αυτόματη παραγωγή πόντων από τα σχολικά είδη
  useEffect(() => {
    const interval = setInterval(() => {
      if (schoolSupplies > 0) {
        const passiveValue = schoolSupplies * libraryAccess * tutoring
        setPoints((prevPoints) => prevPoints + passiveValue)

        // Προσθήκη μικρής πιθανότητας να αποκτήσουμε νέο μάθημα από τα σχολικά είδη
        if (Math.random() < 0.1) {
          const availableSubjectTypes = Math.min(availableSubjects, SUBJECTS.length)
          const randomSubject = SUBJECTS[Math.floor(Math.random() * availableSubjectTypes)]

          setSubjectsLearned((prev) => ({
            ...prev,
            [randomSubject.name]: (prev[randomSubject.name] || 0) + 0.05,
          }))
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [schoolSupplies, libraryAccess, tutoring, availableSubjects])

  // Υπολογισμός του τρέχοντος βαθμού με βάση τους πόντους
  const getCurrentGrade = () => {
    for (let i = GRADES.length - 1; i >= 0; i--) {
      if (points >= GRADES[i].threshold) {
        return GRADES[i].name
      }
    }
    return GRADES[0].name
  }

  // Υπολογισμός προόδου προς τον επόμενο βαθμό
  const getNextGradeProgress = () => {
    const currentGrade = getCurrentGrade()
    const currentGradeIndex = GRADES.findIndex((grade) => grade.name === currentGrade)

    if (currentGradeIndex === GRADES.length - 1) {
      return 100 // Ήδη στον μέγιστο βαθμό
    }

    const currentThreshold = GRADES[currentGradeIndex].threshold
    const nextThreshold = GRADES[currentGradeIndex + 1].threshold
    const progress = ((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100

    return Math.min(Math.max(progress, 0), 100)
  }

  // Υπολογισμός του επόμενου βαθμού
  const getNextGrade = () => {
    const currentGrade = getCurrentGrade()
    const currentGradeIndex = GRADES.findIndex((grade) => grade.name === currentGrade)

    if (currentGradeIndex === GRADES.length - 1) {
      return null // Ήδη στον μέγιστο βαθμό
    }

    return GRADES[currentGradeIndex + 1].name
  }

  // Υπολογισμός του συνολικού αριθμού μαθημάτων που έχουν μαθευτεί
  const calculateTotalSubjects = () => {
    return Object.values(subjectsLearned).reduce((sum, count) => sum + Math.floor(count), 0)
  }

  return (
    <div className="min-h-screen flex items-center justify-center school-bg py-8 px-2 sm:px-4 lg:px-8 relative overflow-hidden w-full">
      <div className="notebook-lines"></div>
      <div className="notebook-margin"></div>

      {/* Pencil particles for visual effect */}
      {Array.from({ length: 10 }).map((_, index) => {
        const size = Math.random() * 30 + 10
        const left = Math.random() * 100
        const delay = Math.random() * 15
        const duration = Math.random() * 10 + 10

        return (
          <div
            key={index}
            className="pencil-particle"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              bottom: `-${size}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        )
      })}

      <div className="w-full max-w-md mx-auto space-y-4 relative z-10">
        <Card
          onClick={handleClick}
          className="shadow-md bg-white/90 backdrop-blur-lg border border-blue-300 cursor-pointer hover:shadow-xl transition-all"
        >
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center text-white">School Clicker</CardTitle>
            <CardDescription className="text-center text-white/80">Study hard and improve your grades!</CardDescription>
          </CardHeader>
          <CardContent className="p-4 relative">
            {clickEffects.map((effect) => (
              <div
                key={effect.id}
                className="absolute pointer-events-none text-lg font-bold animate-fadeOut"
                style={{
                  left: `${effect.x}%`,
                  top: `${effect.y}%`,
                  animation: "floatUp 1s forwards",
                }}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{effect.subject}</span>
                  <span className="text-blue-600">{effect.text}</span>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-blue-500" />
                <p className="text-lg font-bold text-blue-700">Points: {formatPoints(points)}</p>
              </div>
              <div className="flex gap-2">
                <p className="text-sm text-gray-600">
                  Grade: <span className="font-bold text-blue-600">{getCurrentGrade()}</span>
                </p>
              </div>
            </div>

            {/* Grade progress bar */}
            {getNextGrade() && (
              <div className="mb-2">
                <div className="grade-progress">
                  <div className="grade-progress-fill" style={{ width: `${getNextGradeProgress()}%` }}></div>
                </div>
                <div className="grade-label">Next: {getNextGrade()}</div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-blue-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Study Skills</p>
                <p className="text-sm font-medium">Level {Math.floor(studySkills)}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Passive Learning</p>
                <p className="text-sm font-medium">{formatPoints(schoolSupplies * libraryAccess * tutoring)}/s</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Subjects Learned</p>
                <p className="text-sm font-medium">{calculateTotalSubjects()}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Study Streak</p>
                <p className="text-sm font-medium">
                  x{studyStreak} ({studyStreak * 20}% bonus)
                </p>
              </div>
            </div>

            <div className="subjects-grid mb-4">
              {SUBJECTS.slice(0, availableSubjects).map((subject) => {
                const count = Math.floor(subjectsLearned[subject.name] || 0)
                return (
                  <div key={subject.name} className="subject-item" title={`${subject.name}: ${count}`}>
                    <div className="subject-icon">{subject.emoji}</div>
                    <div className="subject-count">{count}</div>
                  </div>
                )
              })}
            </div>

            <Button
              onClick={handleClick}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all hover:scale-105 active:scale-95 study-button"
            >
              <BookOpen className="h-5 w-5 mr-2" /> Study Hard!
            </Button>

            {/* Offline Progress Message */}
            {offlineMessage && (
              <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="absolute inset-0 bg-black/50" onClick={() => setOfflineMessage(null)}></div>
                <div className="relative bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 p-1 rounded-xl animate-pulse max-w-md w-full">
                  <div className="bg-white rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500">
                      Study Progress!
                    </h3>
                    <p className="text-center mb-4 text-gray-700">{offlineMessage.message}</p>
                    <p className="text-center text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500">
                      {formatPoints(offlineMessage.amount)} points
                    </p>
                    <div className="flex justify-center">
                      <button
                        onClick={() => setOfflineMessage(null)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                      >
                        Collect
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md bg-white/90 backdrop-blur-lg border border-blue-300">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-white text-lg sm:text-xl">Education Upgrades</CardTitle>
              <div className="flex space-x-2">
                <button
                  onClick={() => setUpgradesPage(1)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 1 ? "bg-white text-blue-600 font-bold" : "bg-blue-700 text-white"}`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setUpgradesPage(2)}
                  className={`px-2 py-1 text-xs sm:text-sm rounded-md ${upgradesPage === 2 ? "bg-white text-blue-600 font-bold" : "bg-blue-700 text-white"}`}
                >
                  Advanced
                </button>
              </div>
            </div>
            <CardDescription className="text-white/80 text-xs sm:text-sm mt-1">
              {upgradesPage === 1 ? "Improve your basic learning abilities" : "Advanced educational opportunities"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-3 sm:p-4">
            {upgradesPage === 1 ? (
              // Σελίδα 1: Τα βασικά upgrades
              <>
                {UPGRADES.map((upgrade) => {
                  const currentLevel = upgrades[upgrade.id] || 0
                  const cost = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentLevel))
                  const isMaxLevel = upgrade.maxLevel && currentLevel >= upgrade.maxLevel

                  return (
                    <div
                      key={upgrade.id}
                      onClick={() => points >= cost && !isMaxLevel && buyUpgrade(upgrade.id)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-blue-100 transition-all ${
                        points >= cost && !isMaxLevel
                          ? "bg-blue-50 hover:bg-blue-100 cursor-pointer"
                          : "bg-blue-50/70 opacity-70"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-blue-800 flex items-center text-sm">
                          {upgrade.icon} <span className="truncate ml-1">{upgrade.name}</span>
                        </h3>
                        <p className="text-xs text-gray-600 truncate">{upgrade.description}</p>
                        <p className="text-xs text-gray-500">Level: {currentLevel}</p>
                      </div>
                      <div
                        className={`${
                          points >= cost && !isMaxLevel ? "bg-gradient-to-r from-blue-500 to-blue-600" : "bg-gray-300"
                        } text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm ml-2 whitespace-nowrap`}
                      >
                        {isMaxLevel ? "Max" : `Buy (${formatPoints(cost)})`}
                      </div>
                    </div>
                  )
                })}
              </>
            ) : (
              // Σελίδα 2: Προχωρημένα upgrades
              <>
                <div className="bg-blue-50 p-2 sm:p-3 rounded-lg mb-3">
                  <p className="text-xs sm:text-sm text-blue-800">
                    Advanced upgrades unlock powerful multipliers. Each requires certain basic upgrades.
                  </p>
                </div>

                {ADVANCED_UPGRADES.map((upgrade) => {
                  const currentLevel = upgrades[upgrade.id] || 0
                  const cost = Math.floor(upgrade.basePrice * Math.pow(upgrade.priceMultiplier, currentLevel))
                  const isMaxLevel = upgrade.maxLevel && currentLevel >= upgrade.maxLevel

                  // Έλεγχος αν το upgrade είναι ξεκλειδωμένο
                  const reqId = upgrade.unlockRequirement.id
                  const reqLevel = upgrade.unlockRequirement.level
                  const currentReqLevel = upgrades[reqId] || 0
                  const isUnlocked = currentReqLevel >= reqLevel

                  return (
                    <div
                      key={upgrade.id}
                      onClick={() => isUnlocked && points >= cost && !isMaxLevel && buyUpgrade(upgrade.id, true)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border border-blue-100 transition-all ${
                        isUnlocked
                          ? points >= cost && !isMaxLevel
                            ? "bg-blue-50 hover:bg-blue-100 cursor-pointer"
                            : "bg-blue-50/70 opacity-70"
                          : "bg-gray-100 opacity-50"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-blue-800 flex items-center text-sm">
                          {upgrade.icon} <span className="truncate ml-1">{upgrade.name}</span>
                        </h3>
                        <p className="text-xs text-gray-600 truncate">{upgrade.description}</p>
                        <p className="text-xs text-gray-500">
                          {isUnlocked
                            ? `Level: ${currentLevel}`
                            : `Requires ${reqId.replace(/_/g, " ")} level ${reqLevel}`}
                        </p>
                      </div>
                      <div
                        className={`${
                          isUnlocked && points >= cost && !isMaxLevel
                            ? "bg-gradient-to-r from-blue-500 to-blue-600"
                            : "bg-gray-300"
                        } text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-lg text-xs sm:text-sm ml-2 whitespace-nowrap`}
                      >
                        {!isUnlocked ? "Locked" : isMaxLevel ? "Max" : `Buy (${formatPoints(cost)})`}
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SchoolClicker
