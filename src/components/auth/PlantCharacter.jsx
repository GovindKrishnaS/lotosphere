import { motion } from 'framer-motion'

export default function PlantCharacter({ activeField, isTyping, isPasswordVisible }) {
  // Determine plant pose states
  const isPassword = activeField === 'password'
  const isEmail = activeField === 'email' || activeField === 'name'

  // Eye movement offset based on typing email
  const eyeX = isEmail ? (isTyping ? 4 : 2) : 0
  const eyeY = isEmail ? 3 : 0

  return (
    <div className="w-full flex justify-center items-center py-4 select-none pointer-events-none">
      <div className="relative w-28 h-28 flex items-end justify-center">
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl animate-pulse" />

        {/* Terracotta Pot */}
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-2xl relative z-10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Pot Base */}
          <path
            d="M35 85 L42 110 H78 L85 85 Z"
            fill="#C86D51"
            stroke="#9A4832"
            strokeWidth="2"
          />
          {/* Pot Rim */}
          <rect
            x="32"
            y="78"
            width="56"
            height="10"
            rx="3"
            fill="#D97A5E"
            stroke="#9A4832"
            strokeWidth="2"
          />

          {/* Stem & Leaves Container */}
          <g transform="translate(60, 78)">
            {/* Main Stem */}
            <motion.path
              d="M0 0 Q-2 -30 0 -45"
              stroke="#4E7C57"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              animate={{
                d: isPassword
                  ? "M0 0 Q-6 -25 0 -42"
                  : isTyping
                  ? "M0 0 Q2 -32 0 -47"
                  : "M0 0 Q-2 -30 0 -45",
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Left Shy Leaf */}
            <motion.path
              d="M-2 -20 C-30 -25 -25 -50 0 -45"
              fill="#5B8E65"
              stroke="#3A6343"
              strokeWidth="2"
              animate={{
                rotate: isPassword ? (isPasswordVisible ? 25 : 65) : 0,
                x: isPassword ? (isPasswordVisible ? -4 : 10) : 0,
                y: isPassword ? -10 : 0,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              style={{ originX: 0, originY: 1 }}
            />

            {/* Right Shy Leaf */}
            <motion.path
              d="M2 -20 C30 -25 25 -50 0 -45"
              fill="#6B9E75"
              stroke="#3A6343"
              strokeWidth="2"
              animate={{
                rotate: isPassword ? (isPasswordVisible ? -25 : -65) : 0,
                x: isPassword ? (isPasswordVisible ? 4 : -10) : 0,
                y: isPassword ? -10 : 0,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              style={{ originX: 0, originY: 1 }}
            />

            {/* Top Sprout Leaf */}
            <motion.path
              d="M0 -45 C-15 -65 15 -65 0 -45"
              fill="#82B78C"
              stroke="#4E7C57"
              strokeWidth="1.5"
              animate={{
                scale: isTyping ? [1, 1.15, 1] : 1,
                rotate: isPassword ? -10 : 0,
              }}
              transition={{ duration: 0.4 }}
            />

            {/* Face Features on Flower Bud / Center */}
            <motion.g
              animate={{
                x: eyeX,
                y: eyeY,
                opacity: isPassword && !isPasswordVisible ? 0.3 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {/* Left Eye */}
              <circle cx="-6" cy="-35" r={isPassword ? "1.5" : "2.5"} fill="#1A2E1A" />
              {/* Right Eye */}
              <circle cx="6" cy="-35" r={isPassword ? "1.5" : "2.5"} fill="#1A2E1A" />
              {/* Eye Sparkles */}
              {!isPassword && (
                <>
                  <circle cx="-5" cy="-36.5" r="0.8" fill="#FFF" />
                  <circle cx="7" cy="-36.5" r="0.8" fill="#FFF" />
                </>
              )}

              {/* Cute Smile / Peek Mouth */}
              <path
                d={
                  isPassword
                    ? isPasswordVisible
                      ? "M-3 -29 Q0 -27 3 -29" // Curious mouth
                      : "M-2 -28 L2 -28" // Shy line
                    : isTyping
                    ? "M-4 -28 Q0 -22 4 -28" // Happy open mouth
                    : "M-4 -29 Q0 -25 4 -29" // Gentle smile
                }
                stroke="#1A2E1A"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Rosy Cheeks */}
              <ellipse cx="-10" cy="-31" rx="2" ry="1.2" fill="#E88B8B" opacity="0.6" />
              <ellipse cx="10" cy="-31" rx="2" ry="1.2" fill="#E88B8B" opacity="0.6" />
            </motion.g>
          </g>
        </svg>
      </div>
    </div>
  )
}
