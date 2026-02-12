export type Category = 'life' | 'work' | 'love' | 'friendship' | 'wisdom' | 'courage' | 'happiness' | 'success';

export interface Quote {
  id: number;
  text: string;
  author: string;
  category: Category;
}

export const categoryLabels: Record<Category, string> = {
  life: '人生',
  work: '仕事',
  love: '愛',
  friendship: '友情',
  wisdom: '知恵',
  courage: '勇気',
  happiness: '幸福',
  success: '成功',
};

export const quotes: Quote[] = [
  // 人生 (Life)
  { id: 1, text: '人生は自転車に乗るようなもの。バランスを保つためには動き続けなければならない。', author: 'アルベルト・アインシュタイン', category: 'life' },
  { id: 2, text: '人生で最も大切なことは、人生を楽しむこと - 幸せであること、それが全てだ。', author: 'オードリー・ヘプバーン', category: 'life' },
  { id: 3, text: '人生は短い。だから友よ、空騒ぎしたり、争ったりする暇なんてないんだ。', author: 'ジョン・レノン', category: 'life' },
  { id: 4, text: '生きるとは呼吸することではない。行動することだ。', author: 'ジャン＝ジャック・ルソー', category: 'life' },
  { id: 5, text: '人生において最も大切な時とは、常に今この瞬間である。', author: 'レフ・トルストイ', category: 'life' },
  { id: 6, text: '人生はチョコレートの箱のようなもの。開けてみるまで何が入っているかわからない。', author: '映画「フォレスト・ガンプ」', category: 'life' },
  { id: 7, text: '人生とは自分を見つけることではない。人生とは自分を創ることである。', author: 'ジョージ・バーナード・ショー', category: 'life' },
  { id: 8, text: '今日という日は、残りの人生の最初の日である。', author: 'チャールズ・ディードリッヒ', category: 'life' },
  { id: 9, text: '人生は近くで見ると悲劇だが、遠くから見れば喜劇である。', author: 'チャールズ・チャップリン', category: 'life' },
  { id: 10, text: '人生の目的は目的のある人生を送ることである。', author: 'ロバート・バーン', category: 'life' },
  { id: 11, text: '過去を振り返るな。そこに未来はない。', author: '作者不詳', category: 'life' },
  { id: 12, text: '人生に失敗がないと、人生を失敗する。', author: '斎藤茂太', category: 'life' },
  { id: 13, text: '人生における大きな喜びは、君にはできないと世間がいうことをやることだ。', author: 'ウォルター・バジョット', category: 'life' },

  // 仕事 (Work)
  { id: 14, text: '仕事を愛せ。でもその会社を愛するな。なぜなら、いつ会社が君を愛することをやめるかわからないから。', author: 'アブドゥル・カラーム', category: 'work' },
  { id: 15, text: '好きなことを仕事にすれば、一生働かなくてすむ。', author: '孔子', category: 'work' },
  { id: 16, text: '偉大な仕事をする唯一の方法は、自分のしていることを愛することだ。', author: 'スティーブ・ジョブズ', category: 'work' },
  { id: 17, text: '成功の秘訣は、自分の仕事を愛することだ。', author: 'マーク・トウェイン', category: 'work' },
  { id: 18, text: '努力は裏切らない。', author: '日本のことわざ', category: 'work' },
  { id: 19, text: '天才とは1%のひらめきと99%の努力である。', author: 'トーマス・エジソン', category: 'work' },
  { id: 20, text: '小さいことを重ねることが、とんでもないところに行くただ一つの道。', author: 'イチロー', category: 'work' },
  { id: 21, text: '準備万端の人にチャンスが訪れる。これを幸運と呼ぶ。', author: 'オプラ・ウィンフリー', category: 'work' },
  { id: 22, text: '成功とは、失敗から失敗へと情熱を失わずに進むことである。', author: 'ウィンストン・チャーチル', category: 'work' },
  { id: 23, text: '毎日少しずつ。これが強大なものを成し遂げる秘訣だ。', author: '作者不詳', category: 'work' },
  { id: 24, text: '仕事は人生の大部分を占める。だから本当に満足するには、素晴らしい仕事をすると信じることだ。', author: 'スティーブ・ジョブズ', category: 'work' },
  { id: 25, text: '最も重要な決定とは、何をするかではなく、何をしないかを決めることだ。', author: 'スティーブ・ジョブズ', category: 'work' },
  { id: 26, text: '限界は自分が決めるものではない。限界は能力が決めるものでもない。限界は意志が決めるものだ。', author: '本田圭佑', category: 'work' },

  // 愛 (Love)
  { id: 27, text: '愛とは、育てなくてはいけない花のようなもの。', author: 'ジョン・レノン', category: 'love' },
  { id: 28, text: '愛されることより愛することを。理解されることより理解することを。', author: 'アッシジの聖フランチェスコ', category: 'love' },
  { id: 29, text: '愛は最高の教師である。', author: 'プラトン', category: 'love' },
  { id: 30, text: '愛とは、お互いを見つめ合うことではなく、同じ方向を見つめることである。', author: 'アントワーヌ・ド・サン＝テグジュペリ', category: 'love' },
  { id: 31, text: '愛することは、愛されることよりも幸福である。', author: 'ヘルマン・ヘッセ', category: 'love' },
  { id: 32, text: '愛は最も強い感情である。なぜなら同時に頭と心と体を攻撃するから。', author: 'ヴォルテール', category: 'love' },
  { id: 33, text: '愛は憎しみによって終わることはない。愛によってのみ終わる。', author: 'ブッダ', category: 'love' },
  { id: 34, text: '人を愛する者は、常に人から愛される。人を敬う者は、常に人から敬われる。', author: '孟子', category: 'love' },
  { id: 35, text: '愛とは見返りを求めない無償の贈り物である。', author: '作者不詳', category: 'love' },
  { id: 36, text: '真の愛は無限である。与えれば与えるほど、それは大きくなる。', author: 'アントワーヌ・ド・サン＝テグジュペリ', category: 'love' },
  { id: 37, text: '愛されることは幸福ではない。愛することこそ幸福だ。', author: 'ヘルマン・ヘッセ', category: 'love' },
  { id: 38, text: '心で見なくちゃ、ものごとはよく見えないってことさ。かんじんなことは、目に見えないんだよ。', author: 'アントワーヌ・ド・サン＝テグジュペリ', category: 'love' },

  // 友情 (Friendship)
  { id: 39, text: '友とは、あなたについてすべてを知っていて、それでもあなたを好きでいてくれる人のことだ。', author: 'エルバート・ハバード', category: 'friendship' },
  { id: 40, text: '真の友人とは、世界中が君から離れていった時、そばにいてくれる人のことだ。', author: 'ウォルター・ウィンチェル', category: 'friendship' },
  { id: 41, text: '友情とは二つの体に宿る一つの魂である。', author: 'アリストテレス', category: 'friendship' },
  { id: 42, text: '友人は時の試練に耐えた宝物である。', author: 'トーマス・ジェファーソン', category: 'friendship' },
  { id: 43, text: '人生で最も美しいものは、心と心のつながりである。', author: '作者不詳', category: 'friendship' },
  { id: 44, text: '真の友情は静かに育つ。', author: 'サミュエル・ジョンソン', category: 'friendship' },
  { id: 45, text: '友人は困難な時に試される。', author: 'キケロ', category: 'friendship' },
  { id: 46, text: '一人の良い友人は、千人の親戚に勝る。', author: 'インドのことわざ', category: 'friendship' },
  { id: 47, text: '友情は愛から羽を取ったものである。', author: 'ジョージ・ゴードン・バイロン', category: 'friendship' },
  { id: 48, text: '友情は喜びを二倍にし、悲しみを半分にする。', author: 'マーカス・トゥリウス・キケロ', category: 'friendship' },
  { id: 49, text: '友を得る唯一の方法は、自分がその人の友となることだ。', author: 'ラルフ・ワルド・エマーソン', category: 'friendship' },
  { id: 50, text: '笑いは友情の最も短い距離である。', author: 'ヴィクトル・ボルジュ', category: 'friendship' },

  // 知恵 (Wisdom)
  { id: 51, text: '賢者は聞き、愚者は語る。', author: 'ソロモン王', category: 'wisdom' },
  { id: 52, text: '知恵とは人生の経験から生まれる。', author: '孔子', category: 'wisdom' },
  { id: 53, text: '無知を恐れるな。偽りの知識を恐れよ。', author: 'ブレーズ・パスカル', category: 'wisdom' },
  { id: 54, text: '知ることと理解することは別のことである。', author: 'アルベルト・アインシュタイン', category: 'wisdom' },
  { id: 55, text: '知恵の始まりは、知恵を得たいという願望である。', author: 'ソクラテス', category: 'wisdom' },
  { id: 56, text: '学んで思わざれば則ち罔し、思うて学ばざれば則ち殆し。', author: '孔子', category: 'wisdom' },
  { id: 57, text: '読書は心の栄養である。', author: 'ジョゼフ・アディソン', category: 'wisdom' },
  { id: 58, text: '知者は水を楽しみ、仁者は山を楽しむ。', author: '孔子', category: 'wisdom' },
  { id: 59, text: '真の知性とは知識ではなく想像力である。', author: 'アルベルト・アインシュタイン', category: 'wisdom' },
  { id: 60, text: '自分自身を知ることは、すべての知恵の始まりである。', author: 'アリストテレス', category: 'wisdom' },
  { id: 61, text: '私が知っているのは、私は何も知らないということだけだ。', author: 'ソクラテス', category: 'wisdom' },
  { id: 62, text: '最も難しいのは自分自身を知ることであり、最も簡単なのは他人にアドバイスすることだ。', author: 'タレス', category: 'wisdom' },
  { id: 63, text: '言葉は銀、沈黙は金。', author: 'トーマス・カーライル', category: 'wisdom' },

  // 勇気 (Courage)
  { id: 64, text: '勇気とは、恐怖がないことではなく、恐怖に打ち勝つことである。', author: 'ネルソン・マンデラ', category: 'courage' },
  { id: 65, text: '恐怖を感じないのは勇気ではない。恐怖を感じながら行動するのが勇気である。', author: 'マーク・トウェイン', category: 'courage' },
  { id: 66, text: '勇気とは、立ち上がって声を上げることだ。勇気とは、座って耳を傾けることでもある。', author: 'ウィンストン・チャーチル', category: 'courage' },
  { id: 67, text: '成功は最終的なものではなく、失敗は致命的なものではない。大切なのは続ける勇気だ。', author: 'ウィンストン・チャーチル', category: 'courage' },
  { id: 68, text: '虎穴に入らずんば虎子を得ず。', author: '中国のことわざ', category: 'courage' },
  { id: 69, text: '夢を見る勇気があれば、どんな夢も実現できる。', author: 'ウォルト・ディズニー', category: 'courage' },
  { id: 70, text: '失敗を恐れるよりも、挑戦しないことを恐れよ。', author: 'マイケル・ジョーダン', category: 'courage' },
  { id: 71, text: '勇気ある行動は、言葉よりも雄弁に物語る。', author: 'ウィリアム・シェイクスピア', category: 'courage' },
  { id: 72, text: '人生で最も勇気のいることは、自分の心に正直であることだ。', author: '作者不詳', category: 'courage' },
  { id: 73, text: '勇気は筋肉のようなもの。使えば使うほど強くなる。', author: 'ルース・ゴードン', category: 'courage' },
  { id: 74, text: '勇気とは、快適なところを出て、未知へ踏み出すことだ。', author: '作者不詳', category: 'courage' },
  { id: 75, text: '最大のリスクは、リスクを取らないことだ。', author: 'マーク・ザッカーバーグ', category: 'courage' },

  // 幸福 (Happiness)
  { id: 76, text: '幸福とは、あなたが考えること、言うこと、することが調和している状態だ。', author: 'マハトマ・ガンジー', category: 'happiness' },
  { id: 77, text: '幸せは目的地ではなく、旅の途中にある。', author: 'ラルフ・ワルド・エマーソン', category: 'happiness' },
  { id: 78, text: '幸せの秘訣は、持っているものを数えることであり、欲しいものを数えることではない。', author: '作者不詳', category: 'happiness' },
  { id: 79, text: '幸福は外から来るものではなく、内側から生まれるものだ。', author: 'マルクス・アウレリウス', category: 'happiness' },
  { id: 80, text: '笑顔は幸福の始まりである。', author: 'マザー・テレサ', category: 'happiness' },
  { id: 81, text: '幸せになりたければ、幸せを選びなさい。', author: 'レフ・トルストイ', category: 'happiness' },
  { id: 82, text: '人生を楽しむ秘訣は、小さなことに喜びを見つけることだ。', author: '作者不詳', category: 'happiness' },
  { id: 83, text: '幸福は分かち合うことで二倍になる。', author: 'アルベール・シュヴァイツァー', category: 'happiness' },
  { id: 84, text: '今この瞬間を生きることが、幸せへの最短の道だ。', author: 'ブッダ', category: 'happiness' },
  { id: 85, text: '幸せは得るものではなく、気づくものである。', author: '作者不詳', category: 'happiness' },
  { id: 86, text: '最も幸せな人とは、最も多くを持つ人ではなく、最も感謝する人である。', author: '作者不詳', category: 'happiness' },
  { id: 87, text: '幸福とは副産物である。何か別のことに没頭しているときに訪れる。', author: 'ビクター・フランクル', category: 'happiness' },
  { id: 88, text: '今日一日を最高の日にしよう。', author: '作者不詳', category: 'happiness' },

  // 成功 (Success)
  { id: 89, text: '成功とは、失敗を重ねても情熱を失わないことである。', author: 'ウィンストン・チャーチル', category: 'success' },
  { id: 90, text: '成功の秘訣は、成功するまで諦めないことだ。', author: 'アルベルト・アインシュタイン', category: 'success' },
  { id: 91, text: '成功は偶然ではない。努力、忍耐、学習、研究、犠牲、そして何より愛情の結果である。', author: 'ペレ', category: 'success' },
  { id: 92, text: '成功は旅であり、目的地ではない。', author: 'ベン・スウィートランド', category: 'success' },
  { id: 93, text: '夢は逃げない。逃げるのはいつも自分だ。', author: '高橋歩', category: 'success' },
  { id: 94, text: '失敗は成功のもと。', author: '日本のことわざ', category: 'success' },
  { id: 95, text: '成功の反対は失敗ではなく、挑戦しないことだ。', author: '作者不詳', category: 'success' },
  { id: 96, text: '成功とは、自分が何を望んでいるかを知り、それを得るために努力することだ。', author: 'アール・ナイチンゲール', category: 'success' },
  { id: 97, text: '小さな成功を積み重ねることが、大きな成功につながる。', author: '作者不詳', category: 'success' },
  { id: 98, text: '成功した人は皆、最初は夢想家だった。', author: 'ウッドロウ・ウィルソン', category: 'success' },
  { id: 99, text: '成功への道は常に工事中である。', author: 'リリー・トムリン', category: 'success' },
  { id: 100, text: '成功者になろうとするな。価値ある人間になろうとせよ。', author: 'アルベルト・アインシュタイン', category: 'success' },
  { id: 101, text: '成功は準備がチャンスに出会った時に起こる。', author: 'セネカ', category: 'success' },
  { id: 102, text: '不可能とは、自らの力で世界を切り開くことを放棄した臆病者の言葉だ。', author: 'モハメド・アリ', category: 'success' },
  { id: 103, text: 'すべての偉大な成功は、忍耐の結果である。', author: 'ナポレオン・ヒル', category: 'success' },
  { id: 104, text: '成功とは、情熱を失わずに失敗から失敗へと歩むことだ。', author: 'ウィンストン・チャーチル', category: 'success' },
];

export const getQuotesByCategory = (category: Category): Quote[] => {
  return quotes.filter((quote) => quote.category === category);
};

export const getRandomQuote = (): Quote => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

export const getDailyQuote = (): Quote => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % quotes.length;
  return quotes[index];
};

export const getQuoteById = (id: number): Quote | undefined => {
  return quotes.find((quote) => quote.id === id);
};
