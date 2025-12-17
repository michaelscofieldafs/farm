export interface GameTimerTextProps {
    minutes: number;
    seconds: number;
    expired: boolean;
    isMyTurn: boolean;
}

export const GameTimerText = ({ minutes, seconds, expired, isMyTurn }: GameTimerTextProps) => {
    return (
        <div className="text-sm text-white mb-4">
            {expired ? (
                <span className="text-red-400 font-semibold">
                    ⏳ The game can now be canceled! {!isMyTurn ? 'You can end the match.' : 'The oponnent can end the match.'}
                </span>
            ) : (
                <span>
                    ⏳ Time left until {isMyTurn ? 'the opponent can' : 'you can'} cancel: <strong>{minutes}m {seconds}s</strong>
                </span>
            )}
        </div>
    );
}