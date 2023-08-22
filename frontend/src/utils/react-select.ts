export const customStyle = {
    control: (provided: any, state: any) => ({
        ...provided,
        background: '#fff',
        borderColor: '#9e9e9e',
        minHeight: '25px',
        height: '25px',
        width: '120px',
        boxShadow: state.isFocused ? null : null,
    }),

    valueContainer: (provided: any, state: any) => ({
        ...provided,
        height: '25px',
        padding: '0 6px'
    }),

    input: (provided: any, state: any) => ({
        ...provided,
        margin: '0px',
    }),
    indicatorSeparator: (state: any) => ({
        display: 'none',
    }),
    indicatorsContainer: (provided: any, state: any) => ({
        ...provided,
        height: '25px',
    }),
    menu: (provided: any, state: any) => ({
        ...provided,
        width: '120px',
        
    }),

};