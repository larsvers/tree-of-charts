# some test data
a <- rnorm(100)
distribution <- rnorm(1005)
normOut <- c(rnorm(1000), rnorm(5,1))
normOut2 <- normOut+3
binary <- rbinom(1005,1,.7)
binary2 <- rbinom(1005,1,.4)
dummy <- rep.int(1,1005)
df <- data.frame(n = distribution, nO = normOut2, b = binary, b2 = binary2, d = dummy)
df2 <- df[order(df$b),]
df2$b2[df2$b2 == 1] <- 2
df2$b2[df2$b2 == 0] <- 1


library(ggplot2)

stripchart(a)

ggplot(as.data.frame(distribution), aes(distribution)) +
  geom_histogram(binwidth = .3, color = 'grey', fill = 'white')

ggplot(as.data.frame(distribution), aes(distribution)) +
  geom_density(kernel = 'gaussian', fill='grey', col='grey')

ggplot(df, aes(a)) +
  geom_violin()

ggplot(mtcars, aes(factor(cyl), mpg)) +
  geom_violin(col='grey') +
  ggtitle('Petrol usage by number of cylinder') +
  xlab('Cylinders per car') +
  ylab('Miles per gallon')


library(beanplot)

beanplot(as.numeric(mtcars[,'wt']), 
         main="Weight distribution \n of selected cars \n in '000 lb's",
         col.main='#555555')

library(beeswarm)

beeswarm(nO ~ d, data = df2, 
         pch = 16, pwcol = b2, 
         xlab = '',
         ylab = 'Marks 0 to 7', 
         labels = 'Films',
         main = 'Film marks by region')

legend('topright', legend = c('male', 'female'), title = 'Gender', 
       pch = 16, col = 1:2)

ggplot(as.data.frame(distribution), aes(distribution)) +
  geom_density(kernel = 'gaussian', fill='grey', col='grey') +
  geom_rug()

df <- data.frame(group = c("A", "B", "C", "D"), measure = c(4,5,7,2), se = c(0.5,1,0.8,0.2)) 

ggplot(df, aes(group, measure, ymin = measure-se, ymax = measure+se)) + 
  geom_point(stat="Identity", aes(col="red")) + 
  geom_errorbar(width = 0.2, aes(col="red")) +
  coord_cartesian(ylim = c(0,10))
  

# wordcloud

library(tm)
library(SnowballC)
library(wordcloud)

# Directory
"/Users/lars/Google Drive/viz/projects/text analysis/evernote/My Notes/text"

## load data from directory source

evernote <- VCorpus(DirSource(directory = "/Users/lars/Google Drive/viz/projects/text analysis/evernote/My Notes/text",
                              encoding = "UTF-8"),
                    readerControl = list(language = "en"))


## inspect the Corpus

evernote

inspect(evernote[1:2])

writeLines(as.character(evernote[[1]]))

lapply(evernote[21:22], as.character)

meta(evernote[[1]])

## preparing the Corpus

# Once we have a corpus we typically want to modify the documents in it, 
# e.g., stemming, stopword removal, et cetera. In tm, 
# all this functionality is subsumed into the concept of a transformation. 
# Transformations are done via the tm_map() function which applies (maps) a function to 
# all elements of the corpus. Basically, all transformations work on 
# single text documents and tm_map() just applies them to all documents in a corpus.

evernote <- tm_map(evernote, stripWhitespace)

evernote <- tm_map(evernote, removeWords, stopwords(kind = "en"))

evernote <- tm_map(evernote, stemDocument)


## working on the Corpus

# creating term-document martix (terms in rows, docs in columns, values are counts of words)
# or document-term matrix (docs in rows, terms in columns, values are counts of words)
# returning a sparse matrix

tdm <- TermDocumentMatrix(evernote)

dtm <- DocumentTermMatrix(evernote)

inspect(tdm[1:5,1:10])

tdm

findFreqTerms(tdm, 100) # find terms that appear at least 100 times

findAssocs(tdm,"git",0.8) # find terms that correlate at least .8% with "git"

# Term-document matrices tend to get very big already for normal sized data sets. 
# Therefore we provide a method to remove sparse terms, 
# i.e., terms occurring only in very few documents. 
# Normally, this reduces the matrix dramatically without losing significant relations 
# inherent to the matrix.

# This function call removes those terms which have at least a 40 percentage of sparse 
# (i.e., terms occurring 0 times in a document) elements.

inspect(removeSparseTerms(tdm, 0.4)) 

tdmNS <- removeSparseTerms(tdm, 0.8)

# final wordcount 

tdmNScount <- rowSums(as.matrix(tdmNS))

names(tdmNScount)

tdmNSdf <- data_frame(words = names(tdmNScount), count = tdmNScount)
tdmNSdf <- tdmNSdf[order(tdmNSdf$count, decreasing = T),]

wordcloud(evernote)


