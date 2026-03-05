interface SelectFilesOptions {
    useFirstOnly?: boolean;
}

export const selectFilesForUpload = <T>(
    files: readonly T[],
    options?: SelectFilesOptions
): T[] => {
    if (options?.useFirstOnly) {
        return files.slice(0, 1);
    }

    return files.slice();
};
