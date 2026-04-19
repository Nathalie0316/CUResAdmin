import { motion } from "framer-motion";

// Page Transition Wrapper
function PageTransition({ children }) {
  return (
    <motion.div
      // Enter
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}

      // Exit
      exit={{ opacity: 0, y: -6 }}

      // Timing
      transition={{ duration: 0.30, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;