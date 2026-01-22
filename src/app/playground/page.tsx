import styles from './playground.module.css';

export default function PlaygroundPage() {
    return (
        <div className={styles.container}>
            <div className={styles.glassTooltip}>
                <div className={styles.content}>
                    <div className={styles.counter}>1 of 3</div>
                    <p className={styles.text}>
                        This tooltip uses <code>background: inherit</code> to create a perfect frosted glass effect over the fixed background.
                    </p>
                    <div className={styles.buttonContainer}>
                        <button className={styles.nextButton}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
