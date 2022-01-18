
export const WavePlaceholder = () => {
    //glow
    return (
        <div className="row">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossOrigin="anonymous"></link>
            <p className="placeholder-glow">
                <span className="placeholder placeholder-lg col-12 bg-secondary"></span>
                <span className="placeholder placeholder-lg col-12 bg-secondary"></span>
                <span className="placeholder placeholder-lg col-12 bg-secondary"></span>
                <span className="placeholder placeholder-lg col-12 bg-secondary"></span>
                <span className="placeholder placeholder-lg col-12 bg-secondary"></span>
                <span className="placeholder placeholder-lg col-12 bg-secondary"></span>
                <span className="placeholder placeholder-lg col-12 bg-secondary"></span>
                <span className="placeholder placeholder-lg col-12 bg-secondary"></span>
                {/* <div className="placeholder placeholder-lg col-12 bg-secondary"></div>
                <div className="placeholder placeholder-lg col-12 bg-secondary"></div> */}
            </p>
        </div>
    )
}

export const GrowingSpinner = () => {
    return (
        <div className="d-flex justify-content-center align-items-center gap-2 " style={{ height: "50vh" }}>
            <div className="spinner-grow text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-success" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-info" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}