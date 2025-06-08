import searchIcon from '/search.svg'

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
        <div>
            <img src={searchIcon} alt="search-icon" />
            <input type="text"
            placeholder="Search for your favorite movies and series"  
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    </div>
  )
}

export default Search