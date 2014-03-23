writeJSON_graph <- function(x) {
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

writeJSON_topscores <- function(x) {
	'<b>Top scores:</b> <span class="badge alert-danger">1</span> Me <span class="badge alert-white">0.55</span>, <span class="badge alert-warning">2</span>You, <span class="badge alert-info">3</span> Him, <span class="badge">4</span> Others'
	badge1 <- function(name) {
		paste("<b>Top scores:</b> <span class='badge alert-danger'>1</span>",name,sep=" ")
	}
	badge2 <- function(name) {
		paste(" <span class='badge alert-warning'>2</span>",name,sep=" ")
	} 
	badge3 <- function(name) {
		paste(" <span class='badge alert-info'>3</span>",name,sep=" ")
	}
	badgeother <- function(ind,name) {
		paste(paste(" <span class='badge'>",ind,"</span>",sep=""),name,sep=" ")
	}
	scorebadge <- function(score) {
		paste(" <span class='badge alert-white'>",score,"</span>",sep="")
	}
	to_r <- c()
	for (i in 1:dim(x)[1]) {
		if (i%in%c(1,2,3)) {
			if (i == 1) {
				to_r = paste(to_r,badge1(x[i,1]),sep="")
				} else if (i == 2) {
					to_r = paste(to_r,badge2(x[i,1]),sep="")
					} else if (i == 3) {
						to_r = paste(to_r,badge3(x[i,1]),sep="")
					}
			to_r = paste(to_r,scorebadge(x[i,2]),sep="")
			} else {
				to_r = paste(to_r,badgeother(i,x[i,1]),sep="")
			}
	}
	return(list(
		topscores = to_r
		))
}