interface BuildViewAllLabelClassNameOptions {
    hideOnMobile?: boolean;
}

export const buildViewAllLabelClassName = (
    baseClassName: string,
    options: BuildViewAllLabelClassNameOptions = {}
) => {
    if (!options.hideOnMobile) {
        return baseClassName;
    }

    return `hidden md:inline ${baseClassName}`;
};
