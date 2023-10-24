import { reactive } from "vue";

export const store = reactive({
  word: {},
  setDinosaur(isGuessed, value) {
    this.word.isGuessed = isGuessed;
    this.word.value = value;
  },
});