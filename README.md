# OpenNetwork

## Project Overview

The **Lovable Project** is part of the **OpenNetwork initiative** aimed at creating a collaborative environment for exploring, building, and sharing machine learning models. The platform enables users to visualize architectures in both **2D and 3D**, manage model parameters, and interact with advanced model customization features.

Live Deployment: [OpenSparrow](https://opensparrow.netlify.app)
Project Workspace: [Lovable.dev Project](https://lovable.dev/projects/b63f3bb9-90df-44f2-ac44-3b83c49fd7b4)

**Developer**: Anomitra Sarkar
**Organization**: Dezors Pvt Ltd.

---

## Current Requirements
 
### Primary
* Add another view in the playground, called Ensemble, in which i am able to see three-dimensional low level representation of the Neural Network, from nodes to all intern node connections, be very careful about this. for example let the dense neural network's nodes be small spheres and each connection be lines, use R3F or ThreeJs if required. for convolutional network show the 2D convolution rectangular representation, so for like dense neural network of 10 neurons, i should 10 small sphere each of them connecting to the other dense layer in front of it.


### Secondary
* the entire design has to be black-backgroundish
* no gradients in the entire website
* the contrast need to be corrected (background - text) in the website
All new requirements should be added **without altering existing functionality**.
* profiles tab to create name, <sync with authentication>
* the colors of neurons should be different based on the bias provided to it. therefore create a map of bias to color

---

## Todo
* \[-] Include splash screen on startup and loadings, also make the design concurrent with the favico provided
* \[\*] Setup Save settings using Firebase or authentication using Supabase
* \[-] Load using ML file parsers, or include TensorFlow\.js
* \[\*] Function representation in model representation for activation functions
* \[-] Save in ML-based formats
* \[-] Build a pip library for representational AI with a Gradio-based interface, hosted locally
* \[\*] Create segregation dropdowns (e.g., All, Layers, Activations, etc.)
* \[-] Sequential data integration in training
* \[-] Scroll bar fixation 
* \[-] Design bar fixation

---

## Features

1. **2D View** – Flat visualization of network architectures
2. **3D View** – Interactive three-dimensional exploration of models
3. **Weight Visualization** – Xavier initialization with graphical output
4. **Model Creation** – Support for core layers and activation functions
5. **Ensemble Support** – Repository for combined model structures in Explore tab
6. **Architectural Overview** – High-level schematic of model design
7. **Load JSON** – Import model definitions via JSON format
8. **Save JSON** – Export models into JSON format
9. **Load/Save in MLops Formats** – Planned support for broader ML file standards
10. **OAuth for Local Storage** – Secure login and storage for model management
11. **Quick Architectures** – Prebuilt templates for fast prototyping
12. **Weight Distribution Histogram** – Layer-wise parameter statistics
13. **Function Blocks** – Modular function representation
14. **Activation Representation** – Clear visualization of activation functions
15. **Layer Inspector** – Customization menu for layer-specific adjustments
16. **Trainable Parameters Setup** – Flexible parameter tuning
17. **Parameter Count Up** – Automatic parameter tracking
18. **Full Customization** – End-to-end editable architectures
19. **Hostable pip Library** – Python integration to dynamically use the platform
20. **Documentation + PyPI API Docs** – Structured technical documentation for developers
