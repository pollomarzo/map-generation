# From Philosophy to Interfaces: an Explanatory Method and a Tool Inspired by Achinstein’s Theory of Explanation

In this repository you'll find the source code and the data used in the experiments of our paper: "From Philosophy to Interfaces: an Explanatory Method and a Tool Inspired by Achinstein’s Theory of Explanation".
This paper has been presented at [ACM IUI 2021](https://iui.acm.org/2021/), the 26th annual meeting of the intelligent interfaces, in April the 15th.

Installation
-------
* Run `software/yai_baseline/setup.sh` to install the baseline's dependencies. Before running it, be sure that virtualenv and pip are both installed in your local python environment. To install virtualenv run `pip install virtualenv`.
* Run `software/yai_alternative/setup.sh` to install the alternative's dependencies. Before running it, be sure that virtualenv and pip are both installed in your local python environment. To install virtualenv run `pip install virtualenv`.

Installation - The HELOC Dataset
-------
* The HELOC dataset and more information about it, including instructions to download, can be found at [https://community.fico.com/s/explainable-machine-learning-challenge?tabset-3158a=2](https://community.fico.com/s/explainable-machine-learning-challenge?tabset-3158a=2). Copy and paste the file [heloc_dataset.csv](https://github.com/explainX/explainx/blob/4f125c324c32d9ed475baa425fce650e16074d4d/datasets/heloc_dataset.csv) into [software/yai_baseline/aix](software/yai_baseline/aix) and [software/yai_alternative/aix](software/yai_alternative/aix)

How to run the demos
-------
* After installing, run `software/yai_baseline/server.sh 8000` to start the baseline at port 8000. The first time you run it may take a while, training the neural network for credit approval (therefore generating the npz file). Log files are generated in the [aix](software/yai_baseline/aix), [oke](software/yai_baseline/oke) and [yai](software/yai_baseline/yai) folders.
* After installing, run `software/yai_alternative/server.sh 8080` to start the alternative to the baseline, at port 8080. The first time you run it may take a while, training the neural network for credit approval (therefore generating the npz file) and downloading the language models for summarisation and question-answer retrieval (a few GB each one). Log files are saved in the [aix](software/yai_alternative/aix), [oke](software/yai_alternative/oke) and [yai](software/yai_alternative/yai) folders.

Extra Documentation
-------
* We share with you a [pitch](documentation/pitch.pdf) summarising the salient aspects of the proposed technology, and a brief [video](documentation/demo-presentation.mkv) presenting the live demo.

The Code
-------
* The code of the baseline is at [software/yai_baseline](software/yai_baseline).
* The code of our user-centric variation of the baseline is at [software/yai_alternative](software/yai_alternative).

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