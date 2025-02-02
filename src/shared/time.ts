export const formatTimeAgo = (timestamp: number): string => {
    const minutesAgo = -getMinutesDifference(timestamp);
    if (minutesAgo < 60) {
        return `${minutesAgo} minutes ago`;
    }
    if (minutesAgo < 24 * 60) {
        const hours = Math.floor(minutesAgo / 60);
        return `${hours} hours ago`;
    }
    if (minutesAgo < 7 * 24 * 60) {
        const days = Math.floor(minutesAgo / (24 * 60));
        return `${days} days ago`;
    }

    const totalDays = Math.floor(minutesAgo / (24 * 60));
    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    return remainingDays ? `${weeks} weeks ${remainingDays} days ago` : `${weeks} weeks ago`;
};

export const formatTimeLeft = (timestamp: number): string => {
    const minutesLeft = getMinutesDifference(timestamp);
    if (minutesLeft <= 0) {
        return "Due now";
    }
    if (minutesLeft < 60) {
        return `${minutesLeft} minutes left`;
    }
    if (minutesLeft < 24 * 60) {
        const hours = Math.floor(minutesLeft / 60);
        return `${hours} hours left`;
    }
    const days = Math.floor(minutesLeft / (24 * 60));
    return `${days} days left`;
};

export const getMinutesDifference = (timestamp: number): number => {
    return Math.floor((timestamp - Date.now()) / (1000 * 60));
};
