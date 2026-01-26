"use client";

import { motion } from 'framer-motion';
import styles from './playground.module.css';

export default function PlaygroundPage() {
    const slatCount = 20;
    const slats = Array.from({ length: slatCount });

    return (
        <div className={styles.container}>

            {/* Background Blinds Layer */}
            <div className={styles.blindsBackground}>
                {/* Top Section - Vertical Green Blinds */}
                <div className={styles.verticalBlindsArea}>
                    <div className={styles.blindsTopVertical}>
                        {slats.map((_, i) => (
                            <motion.div
                                key={`top-v-${i}`}
                                className={styles.slatTopVertical}
                                initial={{ opacity: 1, scaleX: 1, x: 0 }}
                                animate={{ opacity: 0, scaleX: 0, x: (i - slatCount / 2) * 50 }}
                                transition={{
                                    duration: 2,
                                    delay: Math.abs(i - slatCount / 2) * 0.1,
                                    ease: [0.16, 1, 0.3, 1],
                                    repeat: Infinity,
                                    repeatDelay: 2
                                }}
                            />
                        ))}
                    </div>

                    {/* Bottom Section - Vertical Brown Blinds */}
                    <div className={styles.blindsBottomVertical}>
                        {slats.map((_, i) => (
                            <motion.div
                                key={`bottom-v-${i}`}
                                className={styles.slatBottomVertical}
                                initial={{ opacity: 1, scaleX: 1, x: 0 }}
                                animate={{ opacity: 0, scaleX: 0, x: (i - slatCount / 2) * 50 }}
                                transition={{
                                    duration: 2,
                                    delay: Math.abs(i - slatCount / 2) * 0.1,
                                    ease: [0.16, 1, 0.3, 1],
                                    repeat: Infinity,
                                    repeatDelay: 2
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.glassTooltip}>
                <div className={styles.content}>
                    <p className={styles.text}>
                        Create interactive product walkthroughs that guide users through your interface with cinematic motion and depth.
                    </p>
                    <div className={styles.footer}>
                        <span className={styles.stepIndicator}>1 of 3</span>
                        <button className={styles.nextButton}>Playback</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
