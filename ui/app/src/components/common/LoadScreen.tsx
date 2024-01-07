import { Spinner } from "@notan/components/ui/spinner";
import { motion } from "framer-motion";
import { FC } from "react";

import { cn } from "../../lib/utils";

export const LoadScreen: FC<{ loading?: boolean }> = ({ loading }) => {
  return (
    <motion.div
      className={cn(
        "z-[9999] fixed h-full w-full bg-background flex items-center justify-center pointer-events-none"
      )}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 100 },
      }}
      // transition={{ delay: 1 }}
      initial={"visible"}
      animate={loading ? "visible" : "hidden"}
    >
      <Spinner size="md" />
    </motion.div>
  );
};
