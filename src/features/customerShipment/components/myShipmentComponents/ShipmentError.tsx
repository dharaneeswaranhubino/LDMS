interface Props {
  error: string;
  onRetry: () => void;
}

const ShipmentError = ({ error, onRetry }: Props) => {
  return (
    <div className="h-[calc(100vh-72px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50 to-purple-50">
      <div className="text-center">
        <i className="fa-solid fa-circle-exclamation text-red-400 text-4xl mb-3" />

        <p className="text-slate-700 font-medium mb-1">
          Failed to load shipments
        </p>

        <p className="text-slate-400 text-sm mb-4">{error}</p>

        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-all"
        >
          <i className="fa-solid fa-rotate-right mr-2" />
          Retry
        </button>
      </div>
    </div>
  );
};

export default ShipmentError;
