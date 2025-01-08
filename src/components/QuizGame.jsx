import React, { useState, useEffect } from "react";
import Team from "./Team";
import Question from "./Question";
import Timer from "./Timer";
import Lifeline from "./Lifeline";
import ScoreBoard from "./ScoreBoard";
import CategorySelector from "./CategorySelector";
import FactPopup from "./FactPopup";
import questionsData from "../data/questions.json";
import RoundComplete from "./RoundComplete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faGamepad,
  faSpinner,
  faPlay,
  faSync
} from "@fortawesome/free-solid-svg-icons";
import audioManager from "../utils/audioManager";
import { motion, AnimatePresence } from "framer-motion";

const sections = questionsData.sections;
const questionsPerSection = 6;
const questionsPerTeam = 3;
const totalRounds = 4;

function QuizGame() {
  const [currentTeam, setCurrentTeam] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState([0, 0]);
  const [gameOver, setGameOver] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(null);
  const [lifelinesUsed, setLifelinesUsed] = useState({
    0: { 1: {}, 2: {}, 3: {}, 4: {} },
    1: { 1: {}, 2: {}, 3: {}, 4: {} },
  });
  const [doublePoints, setDoublePoints] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sectionComplete, setSectionComplete] = useState(false);
  const [doubleDipActive, setDoubleDipActive] = useState(false);
  const [powerPapluActive, setPowerPapluActive] = useState(false);
  const [round, setRound] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFact, setShowFact] = useState(false);
  const [teamNames, setTeamNames] = useState(["", ""]);
  const [shouldResetTimer, setShouldResetTimer] = useState(true);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [showNextQuestionButton, setShowNextQuestionButton] = useState(false);
  const [showTimeUpPopup, setShowTimeUpPopup] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [questionAudioTimeout, setQuestionAudioTimeout] = useState(null);
  const [usedQuestions, setUsedQuestions] = useState(() => {
    const savedUsedQuestions = localStorage.getItem('usedQuestions');
    return savedUsedQuestions ? JSON.parse(savedUsedQuestions) : [];
  });
  const [showChangeButton, setShowChangeButton] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "v") {
        setShowChangeButton((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);


  useEffect(() => {
    return () => {
      if (audioManager && audioManager.stop) {
        audioManager.stop("background");
      }
      if (questionAudioTimeout) {
        clearTimeout(questionAudioTimeout);
      }
    };
  }, [questionAudioTimeout]);

  const startGame = () => {
    setGameStarted(true);
    if (audioManager && audioManager.play) {
      audioManager.play("background");
    }
  };

  const getAvailableLifelines = () => {
    const allLifelines = ["50-50", "hint", "change", "double", "doubleDip"];
    if (round === 1) {
      return ["50-50", "hint"];
    }
    return allLifelines;
  };

  const selectCategory = (category) => {
    const availableQuestions = questionsData.questions.filter(
      (q) => q.section === category && !usedQuestions.includes(q.question)
    );
    const shuffledQuestions = shuffleArray(availableQuestions).slice(
      0,
      questionsPerSection
    );
    setQuestions(shuffledQuestions);
    setCurrentSection(category);
    setSelectedCategories([...selectedCategories, category]);
    setCurrentQuestion(0);
    setSectionComplete(false);
    setShouldResetTimer(true);
    playQuestionAudio();

    const newUsedQuestions = [...usedQuestions, ...shuffledQuestions.map(q => q.question)];
    setUsedQuestions(newUsedQuestions);
    localStorage.setItem('usedQuestions', JSON.stringify(newUsedQuestions));
    resetUsedQuestionsIfNeeded();
  };

  const resetUsedQuestionsIfNeeded = () => {
    const totalQuestions = questionsData.questions.length;
    if (usedQuestions.length >= totalQuestions * 0.2) {
      setUsedQuestions([]);
      localStorage.removeItem('usedQuestions');
    }
  };

  const playQuestionAudio = () => {
    if (audioManager && audioManager.stop && audioManager.play) {
      audioManager.stop("questionAppear");
      audioManager.play("questionAppear");
      const timeout = setTimeout(() => {
        audioManager.stop("questionAppear");
      }, 61000); // 90 seconds
      setQuestionAudioTimeout(timeout);
    }
  };

  const handleAnswer = (selectedAnswerIndex) => {
    if (questionAudioTimeout) {
      clearTimeout(questionAudioTimeout);
    }
    if (audioManager && audioManager.stop) {
      audioManager.stop("questionAppear");
    }
  
    if (
      doubleDipActive &&
      selectedAnswerIndex !== questions[currentQuestion].correctAnswer
    ) {
      setDoubleDipActive(false);
      return;
    }
  
    setShowAnswer(true);
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      newQuestions[currentQuestion] = {
        ...newQuestions[currentQuestion],
        selectedAnswer: selectedAnswerIndex,
      };
      return newQuestions;
    });
  
    const correct =
      selectedAnswerIndex === questions[currentQuestion].correctAnswer;
    
    if (correct) {
      if (audioManager && audioManager.play) {
        audioManager.play("correct");
      }
      setScores((prevScores) => {
        const newScores = [...prevScores];
        newScores[currentTeam] += doublePoints ? 2 : 1;
        return newScores;
      });
    } else {
      if (audioManager && audioManager.play) {
        audioManager.play("wrong");
      }
    }
    
    setDoublePoints(false);
    setDoubleDipActive(false);
  
    setTimeout(() => {
      setShowAnswer(false);
      setShowHint(false);
      setShowFact(true);
    }, 4000);
  };
  
  const nextQuestion = () => {
    setShowFact(false);
    setShowCorrectAnswer(false);
    setShowNextQuestionButton(false);
    setShouldResetTimer(true);
    
    if (currentQuestion + 1 < questionsPerSection) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentTeam(currentTeam === 0 ? 1 : 0);
      playQuestionAudio();
    } else {
      setSectionComplete(true);
      if (round < totalRounds) {
        setTimeout(() => {
          setRound((prevRound) => prevRound + 1);
          setCurrentSection(null);
          setSectionComplete(false);
        }, 5000);
      } else {
        setGameOver(true);
      }
    }
  };

  const handleTimeUp = () => {
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      newQuestions[currentQuestion] = {
        ...newQuestions[currentQuestion],
        selectedAnswer: null,
      };
      return newQuestions;
    });
    setShowTimeUpPopup(true);
  };

  const handleNextQuestion = () => {
    setShowTimeUpPopup(false);
    setIsTimerPaused(false);
    nextQuestion();
  };

  const useLifeline = (lifeline) => {
    const availableLifelines = getAvailableLifelines();
    if (!availableLifelines.includes(lifeline)) {
      console.log("Lifeline not available in this round");
      return;
    }

    if (lifelinesUsed[currentTeam][round][lifeline]) {
      console.log("Lifeline already used by this team in this game");
      return;
    }

    setLifelinesUsed((prev) => ({
      ...prev,
      [currentTeam]: {
        ...prev[currentTeam],
        [round]: {
          ...prev[currentTeam][round],
          [lifeline]: true,
        },
      },
    }));

    setShouldResetTimer(false);

    switch (lifeline) {
      case "50-50":
        setQuestions((prevQuestions) => {
          const newQuestions = [...prevQuestions];
          const currentQ = newQuestions[currentQuestion];
          const correctAnswer = currentQ.correctAnswer;
          let optionsToRemove = [0, 1, 2, 3].filter((i) => i !== correctAnswer);
          optionsToRemove = shuffleArray(optionsToRemove).slice(0, 2);

          newQuestions[currentQuestion] = {
            ...currentQ,
            options: currentQ.options.map((option, index) =>
              optionsToRemove.includes(index) ? "" : option
            ),
          };
          return newQuestions;
        });
        break;
      case "change":
        const unusedQuestions = questionsData.questions.filter(
          (q) => q.section === currentSection && !questions.includes(q)
        );
        if (unusedQuestions.length > 0) {
          const newQuestion =
            unusedQuestions[Math.floor(Math.random() * unusedQuestions.length)];
          setQuestions((prevQuestions) => {
            const newQuestions = [...prevQuestions];
            newQuestions[currentQuestion] = newQuestion;
            return newQuestions;
          });
        }
        break;
      case "hint":
        setShowHint(true);
        break;
      case "double":
        setDoublePoints(true);
        break;
      case "doubleDip":
        setDoubleDipActive(true);
        break;
      default:
        console.log("Unknown lifeline");
    }
  };

  const handlePowerPaplu = (lifeline) => {
    if (powerPapluActive) {
      setPowerPapluActive(false);
      setLifelinesUsed((prev) => ({
        ...prev,
        [currentTeam]: {
          ...prev[currentTeam],
          [round]: {
            ...prev[currentTeam][round],
            [lifeline]: false,
          },
        },
      }));
      useLifeline(lifeline);
    }
  };

  const handleTeamNameChange = (index, name) => {
    setTeamNames((prev) => {
      const newNames = [...prev];
      newNames[index] = name;
      return newNames;
    });
  };

  const isLifelineUsed = (lifeline) => {
    return Object.values(lifelinesUsed[currentTeam]).some(
      (roundLifelines) => roundLifelines[lifeline]
    );
  };

  const changeQuestion = () => {
    const unusedQuestions = questionsData.questions.filter(
      (q) => q.section === currentSection && !usedQuestions.includes(q.question)
    );
    if (unusedQuestions.length > 0) {
      const newQuestion = unusedQuestions[Math.floor(Math.random() * unusedQuestions.length)];
      setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
        newQuestions[currentQuestion] = newQuestion;
        return newQuestions;
      });
      setShouldResetTimer(true);
      playQuestionAudio();

      // Update usedQuestions and save to localStorage
      const newUsedQuestions = [...usedQuestions, newQuestion.question];
      setUsedQuestions(newUsedQuestions);
      localStorage.setItem('usedQuestions', JSON.stringify(newUsedQuestions));
      resetUsedQuestionsIfNeeded();
    }
  };

  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-blue-100 to-purple-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          size="5x"
          className="text-blue-500"
        />
      </motion.div>
    );
  }

  if (!gameStarted) {
    return (
      <motion.div
        className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-blue-100 to-purple-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.button
          onClick={startGame}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-2xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FontAwesomeIcon icon={faPlay} className="mr-2" />
          Start Quiz
        </motion.button>
      </motion.div>
    );
  }

  if (gameOver) {
    return <ScoreBoard scores={scores} teamNames={teamNames} />;
  }

  if (!currentSection) {
    return (
      <motion.div
        className="flex flex-col sm:flex-row h-screen bg-gradient-to-br from-blue-100 to-purple-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full sm:w-1/3 bg-gradient-to-b from-blue-200 to-purple-200 flex flex-col justify-center items-start p-4 sm:p-8 shadow-lg rounded-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-8 text-blue-600 flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FontAwesomeIcon icon={faUsers} className="mr-2" />
            Enter Team Names
          </motion.h2>
          <div className="space-y-4 sm:space-y-6 w-full">
            {[0, 1].map((index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <input
                  type="text"
                  value={teamNames[index]}
                  onChange={(e) => handleTeamNameChange(index, e.target.value)}
                  placeholder={`Team ${index + 1} Name`}
                  className="w-full bg-white bg-opacity-50 rounded-lg py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base text-blue-600 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out transform hover:scale-105 hover:ring-4 hover:ring-blue-300"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FontAwesomeIcon
                    icon={faGamepad}
                    className="text-blue-400 text-xl sm:text-3xl transition-transform duration-300 transform hover:scale-125"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="w-full sm:w-2/3 p-4 sm:p-8 flex items-center justify-center">
          <CategorySelector
            categories={sections.filter(
              (section) => !selectedCategories.includes(section)
            )}
            onSelect={selectCategory}
            currentTeam={currentTeam}
            round={round}
            teamName={teamNames[currentTeam]}
          />
        </div>
      </motion.div>
    );
  }

  if (sectionComplete) {
    return (
      <RoundComplete
        round={round}
        teamNames={teamNames}
        scores={scores}
        onContinue={() => setCurrentSection(null)}
      />
    );
  }

  const availableLifelines = getAvailableLifelines();

  return (
    <motion.div
      className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full md:w-1/3 lg:w-1/4 flex flex-row md:flex-col p-2 md:p-4 bg-white shadow-lg">
        <Team
          name={teamNames[0] || "Team 1"}
          score={scores[0]}
          active={currentTeam === 0}
        />
        <div className="flex-1 flex items-center justify-center my-2 md:my-4">
          <div className="grid grid-cols-3 gap-2  max-w-[240px] md:max-w-[300px]">
            {availableLifelines.map((lifeline) => (
              <Lifeline
                key={lifeline}
                name={lifeline}
                onUse={() =>
                  powerPapluActive
                    ? handlePowerPaplu(lifeline)
                    : useLifeline(lifeline)
                }
                disabled={isLifelineUsed(lifeline)}
              />
            ))}
          </div>
        </div>
        <Team
          name={teamNames[1] || "Team 2"}
          score={scores[1]}
          active={currentTeam === 1}
        />
      </div>
      <div className="w-full md:w-2/3 lg:w-3/4 h-full overflow-y-auto p-2 md:p-4 lg:p-8 flex flex-col">
        <motion.h2
          className="text-sm md:text-base lg:text-lg font-bold text-center text-indigo-800"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Round {round}
        </motion.h2>
        <div className="flex justify-center items-center mb-4 lg:mb-8">
          <Timer
            duration={60}
            onTimeUp={handleTimeUp}
            shouldReset={shouldResetTimer}
            isPaused={isTimerPaused}
          />
        </div>
        <div className="flex-grow flex items-center justify-center">
        {showChangeButton && (
        <button
          onClick={changeQuestion}
          className="px-2 py-2 text-xs bg-blue-500 text-white rounded-full hover:bg-yellow-600 transition-colors flex items-center space-x-1 mr-4"
        >
          <FontAwesomeIcon icon={faSync} className="w-3 h-3" />
        </button>
      )}
          <Question
            question={questions[currentQuestion]}
            onAnswer={handleAnswer}
            showAnswer={showAnswer}
            disableOptions={showTimeUpPopup}
            showTimeUpPopup={showTimeUpPopup}
            onNextQuestion={handleNextQuestion}
          />
        </div>
        {showHint && (
          <div className="mt-2 md:mt-4 lg:mt-8 p-2 md:p-4 bg-yellow-100 rounded-lg">
            <p className="text-xs md:text-sm lg:text-base font-semibold text-yellow-800">
              Hint: {questions[currentQuestion].hint}
            </p>
          </div>
        )}
        {doubleDipActive && (
          <div className="mt-2 md:mt-4 lg:mt-8 p-2 md:p-4 bg-blue-100 rounded-lg">
            <p className="text-xs md:text-sm lg:text-base font-semibold text-blue-800">
              Double Dip active: You can give another answer if your first
              answer is incorrect.
            </p>
          </div>
        )}
        {powerPapluActive && (
          <div className="mt-2 md:mt-4 lg:mt-8 p-2 md:p-4 bg-purple-100 rounded-lg">
            <p className="text-xs md:text-sm lg:text-base font-semibold text-purple-800">
              Power Paplu active: Select a previously used lifeline to reuse it.
            </p>
          </div>
        )}
        {showCorrectAnswer && (
          <div className="mt-2 md:mt-4 p-2 md:p-4 bg-green-100 rounded-lg">
            <p className="text-xs md:text-sm lg:text-base font-semibold">
              Correct Answer:{" "}
              {
                questions[currentQuestion].options[
                  questions[currentQuestion].correctAnswer
                ]
              }
            </p>
          </div>
        )}
        {showNextQuestionButton && (
          <div className="mt-2 md:mt-4 flex justify-center">
            <button
              onClick={nextQuestion}
              className="px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Next Question
            </button>
          </div>
        )}
        {showFact && (
          <FactPopup
            fact={questions[currentQuestion].fact}
            onClose={nextQuestion}
          />
        )}
      </div>
    </motion.div>
  );
}

export default QuizGame;