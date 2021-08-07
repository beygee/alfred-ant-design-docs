import algoliasearch from 'algoliasearch'
import alfy from 'alfy'

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

const start = async () => {
  const { hits } = await index.search<AlgoliaHitObject>('icon', {
    hitsPerPage: 20,
    facetFilters: ['tags:en'],
  })

  const filteredHits = hits.filter((hit) => hit.anchor === 'header')

  alfy.output(filteredHits.map((hit) => ({ title: hit.hierarchy.lvl1 ?? '' })))
}

start()
