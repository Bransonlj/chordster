import styles from './IconButton.module.scss';

type ButtonProps = {
    onClick: () => any;
    src: string;
    disabled?: boolean;
}

export default function IconButton({ onClick, src, disabled=false }: ButtonProps) {

    const handleClick = () => {
        if (!disabled) {
            onClick();
        }
    }

    return (
        <div className={`${styles.button} ${disabled ? styles.disabled : styles.enabled}`} onClick={handleClick}>
            <img src={src}/>
        </div>
    )
}