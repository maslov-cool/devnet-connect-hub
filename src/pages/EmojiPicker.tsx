
import React, { useState } from "react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  const [activeTab, setActiveTab] = useState("smileys");

  const emojiCategories = {
    smileys: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘"],
    gestures: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "✋", "🤚", "🖐️", "👋", "🤏"],
    animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧"],
    food: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🥑"],
    activities: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🏓", "🏸", "🥅", "🏒", "🏑", "🥍", "⛳"],
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-64 max-w-[90vw] max-h-[300px] overflow-hidden">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("smileys")}
          className={`p-2 flex-1 ${activeTab === "smileys" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
        >
          😀
        </button>
        <button
          onClick={() => setActiveTab("gestures")}
          className={`p-2 flex-1 ${activeTab === "gestures" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
        >
          👍
        </button>
        <button
          onClick={() => setActiveTab("animals")}
          className={`p-2 flex-1 ${activeTab === "animals" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
        >
          🐶
        </button>
        <button
          onClick={() => setActiveTab("food")}
          className={`p-2 flex-1 ${activeTab === "food" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
        >
          🍎
        </button>
        <button
          onClick={() => setActiveTab("activities")}
          className={`p-2 flex-1 ${activeTab === "activities" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
        >
          ⚽
        </button>
      </div>
      
      <div className="p-2 flex flex-wrap gap-1 overflow-y-auto h-[200px]">
        {emojiCategories[activeTab as keyof typeof emojiCategories].map((emoji) => (
          <button
            key={emoji}
            onClick={() => onEmojiSelect(emoji)}
            className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
