function SearchBar({sc}) {
    return (
        <>
        <div className="search-bar">
            <input type="text" className="search-input" onChange={(e) => sc(e.target.value)} placeholder="Search for vehicles..." />
            
            
            </div></>
    )
}

export default SearchBar;