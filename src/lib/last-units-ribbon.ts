interface LastUnitsRibbonTarget {
    isProject?: boolean | null;
    hasLastUnitsBanner?: boolean | null;
}

export function shouldShowLastUnitsRibbon(
    target: LastUnitsRibbonTarget
): boolean {
    return Boolean(target.isProject && target.hasLastUnitsBanner);
}
