import { delay } from "blend-promise-utils"
import { intersperse } from "rambda"

export const delaySequence = async (spec) => {
  for (let [postDelay, action] of spec) {
    // Not delayed action
    if (action === undefined && typeof postDelay !== "number") {
      action = postDelay
      postDelay = undefined
    }

    // Call function and await if needed
    if (action) {
      let result = action()
      if (result && typeof result.then === "function") await result
    }

    if (postDelay) await delay(postDelay)
  }
}

export const delayTraverse = (timeSeparator, items, action) =>
  delaySequence(
    intersperse(
      [timeSeparator],
      items.map((i) => [() => action(i)])
    )
  )
