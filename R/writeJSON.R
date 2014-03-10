writeJSON <- function(x) {
	list(
		names = x$names,
		links = as.data.frame(x$links),
		game = as.data.frame(x$results),
		degree = x$degree,
		betweenness = x$betweenness,
		other_data = as.data.frame(x$g3data),
		is_high = x$is_high
		)
}