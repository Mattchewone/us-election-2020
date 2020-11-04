(async function () {
  const res = await fetch('https://feeds-elections.foxnews.com/archive/politics/elections/2020/3/2020_Generals/President/national_summary_results/file.json?cb=2020110414571')

  const { candidates, stateResults } = await res.json()

  const trump = candidates.find(p => p.lastName === 'Trump')
  const biden = candidates.find(p => p.lastName === 'Biden')
  
  const results = stateResults.reduce((acc, state) => {
    const trimmedRes = state.results
      .filter(res => (res.candidateNpid === trump.npid || res.candidateNpid === biden.npid))
      .sort((a, b) => {
        return b.votes.percentage - a.votes.percentage
      })
      .map(res => {
        return {
          ...res,
          candidate: res.candidateNpid === trump.npid ? trump : biden
        }
      })

    acc.push({
      ...state,
      results: trimmedRes,
      diff: trimmedRes[0].votes.percentage - trimmedRes[1].votes.percentage
    })

    return acc
  }, []).sort((a, b) => {
    return a.diff - b.diff
  })

  // For debugging
  console.log(results)

  const app = new Vue({
    el: '#app',
    data: {
      results,
      trump,
      biden
    },
    methods: {
      isDem(state) {
        return state.results[0].isWinner && state.results[0].candidateNpid === biden.npid
      },
      isRep(state) {
        return state.results[0].isWinner && state.results[0].candidateNpid === trump.npid
      },
      isLeaningRep(state) {
        return state.results[0].candidateNpid === trump.npid
      },
      isLeaningDem(state) {
        return state.results[0].candidateNpid === biden.npid
      },
    }
  })
})()