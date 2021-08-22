// this file contains the body of YAI, turned into a string.
// this was the easiest way to merge a non-component Vue UI
// and the rest, in React.

export default `
<div id="app" class="container-fluid siteBody">
	<b-modal size="lg" v-model="show_overview_modal" scrollable hide-header hide-footer>
		<b-tabs active-tab-class="modal-dialog-scrollable modal-body">
			<overview v-for="(card,i) in cards" :key="card.uri" :uri="card.uri" :label="card.label"
				:active_fn="() => i==current_card_index"
				:close_fn="() => {cards.splice(i,1); (cards.length>0)?null:show_overview_modal=false;}"
				:onclick_fn="() => current_card_index=i"></overview>
		</b-tabs>
	</b-modal>
	<div class="navbar sticky-top navbar-expand navbar-dark bg-dark" id="header">
		<div id="appTitle" v-html="application.name"></div>
		<!-- <div id="appCustomerIDForm">
					{{loader.label}}
					<input v-model.number="loader.value" type="number" v-on:change="getExplanation" required>
				</div> -->
	</div>
	<br />
	<div id="initial_explanans">
		<div id='appWelcome'>
			<h1>
				<span v-html="application.welcome"></span> <i>{{getCustomerName(loader.value)}}</i>
			</h1>
		</div>
		<hr flex />
		<div>
			<div id="appIntroDesc">
				<img src="yai/img/cust.png" id="appIntroImg">
				<div id="appIntroTitle" class="col">
					<strong v-html="application.intro.desc1"></strong>
					<ul id="customerTitle">
						<li v-for="sub in application.intro.subdesc1" v-html="sub"></li>
					</ul>
				</div>
			</div>
			<hr flex />
			<strong v-show="loader.loading">{{loader.loading_label}}</strong>
			<strong v-show="!loader.loading" v-html="application.contrastiveExplanation.resultHeader"></strong>
			<p id="appOutcome" v-show="!loader.loading" v-html="application.contrastiveExplanation.result"></p>
			<hr flex />
			<div v-show="!loader.loading" id='appContrastiveExplanation'>
				<div>
					<strong v-html="application.contrastiveExplanation.factorHeader"></strong>
					<p></p>
					<p v-html="application.contrastiveExplanation.factorIncipit"></p>
					<ul>
						<li v-for="factor in application.contrastiveExplanation.factors" v-html="factor"></li>
					</ul>
				</div>
				<div v-show="application.contrastiveExplanation.factorsCount > 1">
					<hr flex />
					<strong v-html="application.contrastiveExplanation.importantFactorHeader"></strong>
					<p></p>
					<p v-html="application.contrastiveExplanation.importantFactorIncipit"></p>
					<apexchart type="bar" height="350" :options="application.contrastiveExplanation.chartOptions"
						:series="application.contrastiveExplanation.chartSeries"></apexchart>
				</div>
				<hr flex />
				<div id='appIntroSummary'>
					<strong v-html="application.intro.title"></strong>
					<p></p>
					<p v-html="application.intro.summary"></p>
				</div>
				<hr flex />
			</div>
		</div>
	</div>
</div>
`