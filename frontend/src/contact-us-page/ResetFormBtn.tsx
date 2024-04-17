

const ResetFormBtn = ({
  handleReset
}: {
  handleReset: () => void
}) => {

  const resetAction = () => { handleReset() };

  return (
    <div className="button-container">
      <button className="usa-button" onClick={resetAction} data-testId="reset-button">
        Reset Form 
      </button>
    </div>
  )
}

export default ResetFormBtn