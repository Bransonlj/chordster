import { FilterBy } from "../SongList/SongList"

interface RadioButtonProps {
    filterByName: FilterBy;
    filterByState: FilterBy;
    setFilterBy: React.Dispatch<React.SetStateAction<FilterBy>>;
    labelName: string;
}

export default function RadioButton({ filterByName, filterByState, setFilterBy, labelName }: RadioButtonProps) {
    return (
        <div>
            <input
                type="radio"
                name={filterByName}
                id={filterByName}
                value={filterByName}
                checked={filterByState === filterByName}
                onChange={(e) => setFilterBy(e.target.value as FilterBy)}
            />
            <label htmlFor={filterByName}>{labelName}</label>
        </div>
    )
}