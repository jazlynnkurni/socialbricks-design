"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Transition } from "framer-motion";
import { APP_SHELL_PATH } from "./nav";
import styles from "./BrandMark.module.css";

// The sidebar brand mark: logo plus wordmark, linking to the dashboard. The
// wordmark carries an always-on teal-to-black shimmer; on hover or keyboard
// focus it pulses and the logo floats, signalling the mark is clickable.
export function BrandMark({
  collapsed,
  transition,
}: {
  collapsed: boolean;
  transition: Transition;
}) {
  return (
    <div className="flex h-16 shrink-0 items-center border-b border-border px-4">
      <Link
        href={APP_SHELL_PATH}
        aria-label="SocialBricks home"
        className={`${styles.link} flex items-center gap-3 rounded-lg`}
      >
        <Image
          src="/brand/socialbricks-logo.png"
          alt=""
          width={28}
          height={28}
          priority
          className={styles.logo}
        />
        <motion.span
          initial={false}
          animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
          transition={transition}
          aria-hidden={collapsed}
          className="overflow-hidden whitespace-nowrap font-heading text-base font-semibold"
        >
          <span className={styles.wordmark}>SocialBricks</span>
        </motion.span>
      </Link>
    </div>
  );
}
