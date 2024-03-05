

const ResetFormBtn = ({
  handleReset
}: {
  handleReset: () => void
}) => {

  const resetAction = () => { handleReset() };

  return (
    <div className="button-container">
      <button className="usa-button" onClick={resetAction}>
        Reset Form 
      </button>
    </div>
  )
}

export default ResetFormBtn