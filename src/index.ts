import algoliasearch from 'algoliasearch'
import alfy, { ScriptFilterItem } from 'alfy'
const alfredNotifier = require('alfred-notifier')

alfredNotifier()

const client = algoliasearch('BH4D9OD16A', '60ac2c1a7d26ab713757e4a081e133d0')
const index = client.initIndex('ant_design')

interface AlgoliaHitObject {
  anchor: string
  url: string
  hierarchy: AlgoliaHitObjectHierarchy
}

interface AlgoliaHitObjectHierarchy {
  lvl0: string | null
  lvl1: string | null
  lvl2: string | null
  lvl3: string | null
  lvl4: string | null
  lvl5: string | null
  lvl6: string | null
}

const fetchWithCache = async (searchText: string) => {
  const cachedItems = alfy.cache.get<string, ScriptFilterItem[]>(searchText)
  if (cachedItems) return cachedItems

  const { hits } = await index.search<AlgoliaHitObject>(searchText, {
    hitsPerPage: 20,
    facetFilters: ['tags:en'],
  })

  const filteredHits = hits.filter((hit) => hit.anchor === 'header')

  const items = filteredHits.map<ScriptFilterItem>((hit) => ({
    title: hit.hierarchy.lvl1 ?? '',
    subtitle: hit.hierarchy.lvl0 ?? '',
    arg: hit.url,
  }))

  alfy.cache.set(searchText, items, { maxAge: 1000 * 60 * 60 })

  return items
}

const start = async () => {
  const searchText = alfy.input
  const items = await fetchWithCache(searchText)
  alfy.output(items)
}

start()
