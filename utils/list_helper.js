

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, curr) =>
        sum =+ curr.likes, 0
    )
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((fav, curr) => 
                {
                    const {title, likes, author} = curr.likes > fav.likes ? curr : fav
                    return {title, likes, author}
                })

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}