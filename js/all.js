const app = new Vue({
  el: '#app',
  data: {
    // 網頁的標題(中英)與描述
    site: {
      zh: '',
      en: '',
      description: ''
    },
    degree: {},
    traitEn: [],
    traitZh: [],
    problemList: [],
    descriptions: {},
    questionIdx: -1,
    resultIdx: 0,
  },
  methods: {
    getData() {
      const api = 'https://raw.githubusercontent.com/hexschool/js-training-task/master/api/BigFive.json';
      axios.get(api)
        .then(res => {
          this.site = res.data.name;
          this.site.description = res.data.description;
          this.degree = res.data.degree;
          this.traitEn = res.data.traits.en;
          this.traitZh = res.data.traits.zh;

          this.traitEn.forEach(item => {
            res.data.problemList[item].problems.forEach(problem => {
              this.problemList.push({
                id: problem.id,
                category: problem.category,
                problem: problem.problem,
                options: problem.options,
                score: 0
              })
            });

            // 寫法 01-- Vue $set
            // this.$set(this.descriptions, item, {
            //   traitEn: item,
            //   traitZh: res.data.problemList[item].name,
            //   desc: res.data.problemList[item].description.desc,
            //   high: res.data.problemList[item].description.high,
            //   low: res.data.problemList[item].description.low,
            //   middle: res.data.problemList[item].description.middle,
            // })

            // 寫法 02 -- js 物件寫法
            this.descriptions[item] = {
              traitEn: item,
              traitZh: res.data.problemList[item].name,
              desc: res.data.problemList[item].description.desc,
              high: res.data.problemList[item].description.high,
              low: res.data.problemList[item].description.low,
              middle: res.data.problemList[item].description.middle,
              score: 0,
            }
          });

        })
        .catch(err => {
          console.log(`錯誤訊息為 ${err}`);
        });
    },
    nextPage(score) {
      if (score === 0) return alert('請選擇適合您的選項喔！')
      this.questionIdx += 1;
      if (this.questionIdx === 10) {
        this.getResult();
      }
      // this.questionIdx === 10 ? this.getResult() : this.questionIdx++;
    },
    getResult() {
      this.traitEn.forEach(category => {
        this.problemList.forEach(problem => {
          if (category === problem.category) {
            this.descriptions[category].score += problem.score;
          }
        })
      })
    },
    nextResult() {
      if (this.resultIdx === 4) {
        const result = confirm('確定重新開始測驗嗎？');
        if (result) this.reset();
      } else {
        this.resultIdx += 1;
      }
    },
    reset() {
      this.resultIdx = 0;
      this.problemList = [];
      this.descriptions = {};
      this.questionIdx = -1;
      this.getData();
    }
  },
  created() {
    this.getData();
  },
});