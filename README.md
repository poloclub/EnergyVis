# EnergyVis

A tool for interactively tracking and exploring energy consumption for ML models

[![build](https://github.com/poloclub/EnergyVis/workflows/build/badge.svg)](https://github.com/poloclub/EnergyVis/actions)
[![arxiv badge](https://img.shields.io/badge/arXiv-2103.16435-red)](https://arxiv.org/abs/2103.16435)

<a href="https://youtu.be/QuVsnS9p1Qc" target="_blank"><img src="https://i.imgur.com/gqqnF3d.png" style="max-width:100%;"></a>

For more information, check out our manuscript:

[**EnergyVis: Interactively Tracking and Exploring Energy Consumption for ML Models**](https://arxiv.org/abs/2103.16435).
Omar Shaikh, Jon Saad-Falcon, Austin P Wright, Nilaksh Das, Scott Freitas, Omar Asensio, and Duen Horng (Polo) Chau.
*Extended Abstracts of the 2021 CHI Conference on Human Factors in Computing Systems*

## Live Demo

For a live demo (without using the backend), visit: http://poloclub.github.io/EnergyVis/

## Running Locally

Clone or download this repository:

```bash
git clone git@github.com:poloclub/EnergyVis.git

# use degit if you don't want to download commit histories
degit poloclub/EnergyVis
```

Navigate to the frontend folder:

```bash
cd frontend
```

Install the dependencies:

```bash
yarn install
```

Then run EnergyVis:

```bash
yarn start
```

Navigate to [localhost:5000](https://localhost:5000). You should see EnergyVis running in your broswer :)

## Run Optional Backend

If you want to collect data on your model's energy profile, you can set up live-tracking by starting the EnergyVis backend.

Navigate to the backend folder:

```bash
cd backend
```

Install the backend module:

```bash
pip install --editable ./
```

Use the module in your training code, like documented below:

```python
from carbontracker.tracker import CarbonTracker

tracker = CarbonTracker(epochs=max_epochs)

# Training loop.
for epoch in range(max_epochs):
    tracker.epoch_start()
    
    # Your model training.

    tracker.epoch_end()

# Optional: Add a stop in case of early termination before all monitor_epochs has
# been monitored to ensure that actual consumption is reported.
tracker.stop()
```

In the console, you'll see a backend URL being printed when you run your training code. Simply plug this URL into the EnergyVis frontend to live-track your model.

## Credits

CNN Explainer was created by 
<a href="https://oshaikh.com/">Omar Shaikh</a>,
<a href="https://www.linkedin.com/in/jonsaadfalcon/">Jon Saad-Falcon</a>,
<a href="https://www.austinpwright.com/">Austin P Wright</a>,
<a href="https://nilakshdas.com/">Nilaksh Das</a>,
<a href="https://www.scottfreitas.com/">Scott Freitas</a>,
<a href="https://www.asensioresearch.com/">Omar Asensio</a>, and
<a href="https://www.cc.gatech.edu/~dchau/">Polo Chau</a>

## Citation

```bibTeX
@inproceedings{shaikhEnergyVis2021,
author = {Shaikh, Omar and Saad-Falcon, Jon and Wright, Austin P and Das, Nilaksh and Freitas, Scott and Asensio, Omar and Chau, Duen Horng},
title = {EnergyVis: Interactively Tracking and Exploring Energy Consumption for ML Models},
year = {2021},
isbn = {9781450380959},
publisher = {Association for Computing Machinery},
address = {New York, NY, USA},
url = {https://doi.org/10.1145/3411763.3451780},
doi = {10.1145/3411763.3451780},
booktitle = {Extended Abstracts of the 2021 CHI Conference on Human Factors in Computing Systems},
articleno = {458},
numpages = {7},
keywords = {environmental sustainability, computational equity, machine learning, interactive visualization},
location = {Yokohama, Japan},
series = {CHI EA '21}
}
```

Also, cite carbontracker, which we rely on for our backend!

```bibTeX
@misc{anthony2020carbontracker,
  title={Carbontracker: Tracking and Predicting the Carbon Footprint of Training Deep Learning Models},
  author={Lasse F. Wolff Anthony and Benjamin Kanding and Raghavendra Selvan},
  howpublished={ICML Workshop on Challenges in Deploying and monitoring Machine Learning Systems},
  month={July},
  note={arXiv:2007.03051},
  year={2020}}
```

## License

The software is available under the [MIT License](https://github.com/poloclub/EnergyVis/blob/master/LICENSE).

## Contact

If you have any questions, feel free to [open an issue](https://github.com/poloclub/EnergyVis/issues/new/choose) or contact [Omar Shaikh](https://oshaikh.com).
