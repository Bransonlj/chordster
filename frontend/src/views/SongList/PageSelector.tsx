import styles from './PageSelector.module.scss';

type PageSelectorProps = {
    totalPages: number;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const PAGES_TO_SHOW = 5;

const arrayRange = (start: number, stop: number, step: number): number[] =>
    Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
);

function getPagesToShow(currentPage: number, totalPages: number): number[] {
    if (totalPages < PAGES_TO_SHOW) {
        return arrayRange(1, totalPages, 1);
    }
    if (currentPage > totalPages - Math.round(PAGES_TO_SHOW / 2)) {
        // show last few pages
        return arrayRange(totalPages - PAGES_TO_SHOW + 1, totalPages, 1);
    } 
    if (currentPage <= Math.round(PAGES_TO_SHOW / 2)) {
        // show first few pages
        return arrayRange(1, PAGES_TO_SHOW, 1);
    }
    // show surrounding pages
    return (arrayRange(currentPage - Math.floor(PAGES_TO_SHOW / 2), currentPage + Math.floor(PAGES_TO_SHOW / 2), 1));

}

export default function PageSelector({ totalPages, currentPage, setCurrentPage}: PageSelectorProps) {



    return (
        <div className={styles.pageNumberContainer}>
            <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                >Prev</button>
            {
                currentPage > Math.round(PAGES_TO_SHOW / 2) && <>
                    <span className={styles.pageNumber} onClick={() => setCurrentPage(1)} >1</span>
                    <span>...</span>
                </>
            } 
            { getPagesToShow(currentPage, totalPages).map((thisPage) => (
                    <span 
                        className={`${styles.pageNumber} ${currentPage === thisPage ? styles.selected : ""}`}
                        key={thisPage} 
                        onClick={() => setCurrentPage(thisPage)}    
                    >{thisPage}</span>
                )) 
            }
            {
                currentPage <= totalPages - Math.round(PAGES_TO_SHOW / 2) && <>
                    <span>...</span>
                    <span className={styles.pageNumber} onClick={() => setCurrentPage(totalPages)} >{totalPages}</span>
                </>
            }
            <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                >Next</button>
        </div>
    )
}