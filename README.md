# From Philosophy to Interfaces: an Explanatory Method and a Tool Inspired by Achinstein’s Theory of Explanation

In this repository you'll find the source code and the data used in the experiments of our paper: "From Philosophy to Interfaces: an Explanatory Method and a Tool Inspired by Achinstein’s Theory of Explanation".
This paper has been presented at [ACM IUI 2021](https://iui.acm.org/2021/), the 26th annual meeting of the intelligent interfaces, in April the 15th.

# What this for is
As part of my internship, I'm writing the "visualize and test user comprehension" section. This is a WIP.  To run the server, if you have installed express, path, cors, go (i'll include a package.json soon), into `software/yai_alternative/graph/server` and run `node server.js` or `nodemon server.js` for reload. To install frontend dependencies run `yarn install` or `npm install`. Then use the rest of the app normally; when explanations are loaded, a POST request goes to `localhost:8080` to tell node server about what the user is seeing. Once you're ready to see the result (or at any point inbetween) open `localhost:3000`. Graph data is only fetched on page load, so reload the page to see changes. Server can't be restarted in-between. I included a `curl.txt` file with two simple requests for tests so that you don't need to run the whole thing but just node server on 8080 and frontend on 3000.

Installation
-------
Before installation, be sure that virtualenv and pip are both available to your local python environment. To install virtualenv run `pip install virtualenv`.
* Run `software/yai_baseline/setup.sh` to install the baseline's dependencies.
* Run `software/yai_alternative/setup.sh` to install the alternative's dependencies.
* Install the HELOC dataset:
	* The HELOC dataset and more information about it, including instructions to download, can be found at [https://community.fico.com/s/explainable-machine-learning-challenge?tabset-3158a=2](https://community.fico.com/s/explainable-machine-learning-challenge?tabset-3158a=2). 
	* Copy and paste the file [heloc_dataset.csv](https://github.com/explainX/explainx/blob/4f125c324c32d9ed475baa425fce650e16074d4d/datasets/heloc_dataset.csv) into [software/yai_baseline/aix](software/yai_baseline/aix) and [software/yai_alternative/aix](software/yai_alternative/aix)

The Code
-------
* The code of the baseline is at [software/yai_baseline](software/yai_baseline).
* The code of our user-centred alternative to the baseline is at [software/yai_alternative](software/yai_alternative).

Extra Documentation
-------
We share with you:
* a [pitch](documentation/pitch.pdf) summarising the salient aspects of the proposed technology, 
* a brief [video](documentation/demo-presentation.mkv) presenting the live demo.

How to Run the Demos (after Installation)
-------
Each demo is made of different components:
* The baseline has 2 components:
	* [aix](software/yai_baseline/aix), containing the back-end of the credit approval system: the code for training and deploying the neural network and CEM.
	* [yai](software/yai_baseline/yai), containing the front-end of the credit approval system: the interface.
* The alternative has the same components of the baseline, but the following extra:
	* [oke](software/yai_alternative/oke), containing the back-end of the explanatory AI used for the generation of user-centred explanations.

You can run all the components together by running the scripts:
* `software/yai_alternative/server.sh 8080` to start the alternative to the baseline, at port 8080. 
	* The first time you run it may take a while, training the neural network for credit approval (therefore generating the npz and h5 files) and downloading the pre-trained language models for summarisation and question-answer retrieval (a few GB each one). 
	* Log files are saved in the [aix](software/yai_alternative/aix), [oke](software/yai_alternative/oke) and [yai](software/yai_alternative/yai) folders.
* `software/yai_baseline/server.sh 8000` to start the baseline at port 8000. 
	* The first time you run it may take a while, training the neural network for credit approval (therefore generating the npz and h5 files).
	* Log files are generated in the [aix](software/yai_baseline/aix) and [yai](software/yai_baseline/yai) folders.

For debugging or other reasons, you can run the components separately by executing the following command `python3 server.py 8080` (replace 8080 with the port number you chose) from within the directory of the component.

The User Study
-------
* The collected user studies are in [user_study/data](user_study/data).
* To generate the boxplots and compute the related statistics, run [user_study/result_analyser.py](user_study/result_analyser.py).

Citation
-------

Please use the following bibtex entry:
```
@inproceedings{sovrano2021philosophy,
  title={From Philosophy to Interfaces: an Explanatory Method and a Tool Based on Achinstein's Theory of Explanation},
  author={Sovrano, Francesco and Vitali, Fabio},
  booktitle={Proceedings of the 26th International Conference on Intelligent User Interfaces},
  year={2021},
}
```

Contact
-------

To report issues, use GitHub Issues. For other queries, contact Francesco Sovrano <francesco.sovrano2@unibo.it>
