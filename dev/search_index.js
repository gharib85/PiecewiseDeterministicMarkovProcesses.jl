var documenterSearchIndex = {"docs":
[{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"See also the examples directory for more involved examples. ","category":"page"},{"location":"tutorials/#Basic-example-with-CHV-method-1","page":"Tutorials","title":"Basic example with CHV method","text":"","category":"section"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"A simple example of jump process is shown. We look at the following process of switching dynamics where ","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"X(t) = (x_c(t) x_d(t)) inmathbb Rtimeslbrace-11rbrace","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"In between jumps, x_c evolves according to ","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"dot x_c(t) = 10x_c(t)quadtext if  x_d(t)text is even","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"dot x_c(t) = -3x_c(t)^2quad text otherwise","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"We first need to load the library.  ","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"using PiecewiseDeterministicMarkovProcesses\nconst PDMP = PiecewiseDeterministicMarkovProcesses","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"We then define a function that encodes the dynamics in between jumps. We need to provide the vector field of the ODE. Hence, we define a function that, given the continuous state x_c and the discrete state x_d at time t, returns the vector field. In addition some parameters can be passed with the variable parms.","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"function F!(ẋ, xc, xd, parms, t)\n\tif mod(xd[1],2)==0\n\t\tẋ[1] = 10xc[1]\n\telse\n\t\tẋ[1] = -3xc[1]^2\n\tend\nend","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"Let's consider a stochastic process with following transitions:","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"Transition Rate Reaction number Jump\nx_dto x_d+10 k(x_c) 1 [1]\nx_dto x_d+01 parms 2 [1]","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"We implement these jumps using a 2x1 matrix nu of Integers, such that the jumps on each discrete component xd are given by nu * xd. Hence, we have nu = [1 0;0 -1].\t","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"The rates of these reactions are encoded in the following function.","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"k(x) = 1 + x\n\nfunction R!(rate, xc, xd, parms, t, issum::Bool)\n\t# rate function\n\tif issum == false\n\t# in the case, one is required to mutate the vector `rate`\n\t\trate[1] = k(xc[1])\n\t\trate[2] = parms[1]\n\t\treturn 0.\n\telse\n\t# in this case, one is required to return the sum of the rates\n\t\treturn k(xc[1]) + parms[1]\n\tend\nend\n\n# initial conditions for the continuous/discrete variables\nxc0 = [1.0]\nxd0 = [0, 0]\n\n# matrix of jumps for the discrete variables, analogous to chemical reactions\nnu = [1 0 ; 0 -1]\n\n# parameters\nparms = [50.]","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"We define a problem type by giving the characteristics of the process F, R, Delta, nu, the initial conditions, and the timespan to solve over:","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"Random.seed!(8) # to get the same result as this simulation!\nproblem = PDMP.PDMPProblem(F!, R!, nu, xc0, xd0, parms, (0.0, 10.0))","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"After defining the problem, you solve it using solve.","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"sol =  PDMP.solve(problem, CHV(CVODE_BDF()))","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"In this case, we chose to sample pb with the CHV algorithm where the flow in between jumps is integrated with the solver CVODE_BDF() from DifferentialEquations.jl.","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"We can then plot the solution as follows:","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"# plotting\nusing Plots\nPlots.plot(sol.time,sol.xc[1,:],label=\"xc\")","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"This produces the graph:","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"(Image: TCP)","category":"page"},{"location":"tutorials/#Basic-example-with-the-rejection-method-1","page":"Tutorials","title":"Basic example with the rejection method","text":"","category":"section"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"The previous method is useful when the total rate function varies a lot. In the case where the total rate is mostly constant in between jumps, the rejection method is more appropriate. ","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"The rejection method assumes some a priori knowledge of the process one wants to simulate. In particular, the user must be able to provide a bound on the total rate. More precisely, the user must provide a constant bound in between the jumps. To use this method, R_tcp! must return sum(rate), bound_rejection. Note that this means that in between jumps, one has:","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"sum(rate)(t) <= bound_rejection","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"function R2!(rate, xc, xd, parms, t, issum::Bool)\n\t# rate function\n\tbound_rejection = 1. + parms[1] + 15  # bound on the total rate\n\tif issum == false\n\t# in the case, one is required to mutate the vector `rate`\n\t\trate[1] = k(xc[1])\n\t\trate[2] = parms[1]\n\t\treturn 0., bound_rejection\n\telse\n\t# in this case, one is required to return the sum of the rates\n\t\treturn k(xc[1]) + parms[1], bound_rejection\n\tend\nend","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"We can now simulate this process as follows","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"Random.seed!(8) # to get the same result as this simulation!\nproblem = PDMP.PDMPProblem(F!, R2!, nu, xc0, xd0, parms, (0.0, 1.0))\nsol =  PDMP.solve(problem, Rejection(CVODE_BDF()))","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"In this case, we chose to sample pb with the Rejection algorithm where the flow in between jumps is integrated with the solver CVODE_BDF() from DifferentialEquations.jl.","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"We can then plot the solution as follows:","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"# plotting\nusing Plots\nPlots.plot(sol.time,sol.xc[1,:],label=\"xc\")","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"This produces the graph:","category":"page"},{"location":"tutorials/#","page":"Tutorials","title":"Tutorials","text":"(Image: TCP)","category":"page"},{"location":"addFeatures/#Specify-a-jump-with-a-function-1","page":"FAQ","title":"Specify a jump with a function","text":"","category":"section"},{"location":"addFeatures/#","page":"FAQ","title":"FAQ","text":"See examples/pdmp_example_eva.jl for an example.","category":"page"},{"location":"addFeatures/#Rejection-method-stopped,-recover-data!-1","page":"FAQ","title":"Rejection method stopped, recover data!","text":"","category":"section"},{"location":"addFeatures/#","page":"FAQ","title":"FAQ","text":"If you chose an upper bound for the rejection method that is too small and triggers an interruption like","category":"page"},{"location":"addFeatures/#","page":"FAQ","title":"FAQ","text":"ERROR: AssertionError: Error, your bound on the rates is not high enough!, [26.730756983739408, 20.0]","category":"page"},{"location":"addFeatures/#","page":"FAQ","title":"FAQ","text":"the solve does not return anything. However, in order to understand why your bound is too small, you would like to have a look at your trajectory up to the point where you bound failed. Don't worry, your computation is still in memory!","category":"page"},{"location":"addFeatures/#","page":"FAQ","title":"FAQ","text":"If your call is like this:","category":"page"},{"location":"addFeatures/#","page":"FAQ","title":"FAQ","text":"sol = solve(problem, Rejection(Tsit5()) )","category":"page"},{"location":"addFeatures/#","page":"FAQ","title":"FAQ","text":"then the trajectory is saved in the variables problem.time, problem.Xc and problem.Xd.","category":"page"},{"location":"problem/#Mathematical-Specification-of-a-PDMP-Problem-1","page":"Problem Type","title":"Mathematical Specification of a PDMP Problem","text":"","category":"section"},{"location":"problem/#Vector-field-1","page":"Problem Type","title":"Vector field","text":"","category":"section"},{"location":"problem/#","page":"Problem Type","title":"Problem Type","text":"To define a PDMP Problem, you first need to give the function F and the initial condition x_c0 which define an ODE:","category":"page"},{"location":"problem/#","page":"Problem Type","title":"Problem Type","text":"fracdx_cdt = F(x_c(t)x_d(t)pt)","category":"page"},{"location":"problem/#","page":"Problem Type","title":"Problem Type","text":"where F should be specified in-place as F(dxc,xc,xd,p,t), and xc0 should be an AbstractArray (or number) whose geometry matches the desired geometry of xc. Note that we are not limited to numbers or vectors for xc0; one is allowed to provide u₀ as arbitrary matrices / higher dimension tensors as well.","category":"page"},{"location":"problem/#Jumps-1","page":"Problem Type","title":"Jumps","text":"","category":"section"},{"location":"problem/#","page":"Problem Type","title":"Problem Type","text":"Jumps are defined as a Jump process which change states at some rate R which is a scalar function of the type ","category":"page"},{"location":"problem/#","page":"Problem Type","title":"Problem Type","text":"R(x_c(t)x_d(t)pt)","category":"page"},{"location":"problem/#","page":"Problem Type","title":"Problem Type","text":"Note, that in between jumps, x_d(t) is constant but x_c(t) is allowed to evolve. R should be specified in-place as R(rate,xc,xd,p,t,issum::Bool) where it mutates rate. Note that a boolean issum is provided and the behavior of R should be as follows","category":"page"},{"location":"problem/#","page":"Problem Type","title":"Problem Type","text":"if issum == true, we only required R to return the total rate, e.g. sum(rate). We use this formalism because sometimes you can compute the sum without mutating rate.\nif issum == true, R must populate rate with the updated rate ","category":"page"},{"location":"problem/#","page":"Problem Type","title":"Problem Type","text":"We then need to provide the way the jumps affect the state variable. There are two possible ways here:","category":"page"},{"location":"problem/#","page":"Problem Type","title":"Problem Type","text":"either give a transition matrix nu: it will only affects the discrete component xd and leave xc unaffected.\ngive a function to implement jumps Delta(xc, xd, parms, t, ind_reaction::Int64) where you can mutate xc,xd or parms. The argument ind_reaction is the index of the reaction at which the jump occurs. See examples/pdmp_example_eva.jl for an example.","category":"page"},{"location":"problem/#Problem-Type-1","page":"Problem Type","title":"Problem Type","text":"","category":"section"},{"location":"problem/#Constructor-1","page":"Problem Type","title":"Constructor","text":"","category":"section"},{"location":"problem/#","page":"Problem Type","title":"Problem Type","text":"PDMPProblem(F,R,Delta,nu,xc0,xd0,p,tspan)\nPDMPProblem(F,R,nu,xc0,xd0,p,tspan) when ones does not want to provide the function Delta\nPDMPProblem(F,R,Delta,reaction_number::Int64,xc0,xd0,p,tspan) when ones does not want to provide the transition matrix nu. The length reaction_number of the rate vector must then be provided.","category":"page"},{"location":"problem/#","page":"Problem Type","title":"Problem Type","text":"We also provide a wrapper to DiffEqJump.jl. This is quite similar to how a JumpProblem would be created.","category":"page"},{"location":"problem/#","page":"Problem Type","title":"Problem Type","text":"PDMPProblem(prob, jumps...) where prob can be an ODEProblem. For an example, please consider example/examplediffeqjumpwrapper.jl.","category":"page"},{"location":"problem/#Fields-1","page":"Problem Type","title":"Fields","text":"","category":"section"},{"location":"problem/#","page":"Problem Type","title":"Problem Type","text":"F: the function of the ODE\nR: the function to compute the transition rates\nDelta [Optional]: the function to effect the jumps\nnu [Optional]: the transition matrix\nxc0: the initial condition of the continuous part\nxd0: the initial condition of the discrete part\np: the parameters to be provided to the functions F, R, Delta\ntspan: The timespan for the problem.","category":"page"},{"location":"solver/#PDMP-Solvers-1","page":"Solver Algorithms","title":"PDMP Solvers","text":"","category":"section"},{"location":"solver/#","page":"Solver Algorithms","title":"Solver Algorithms","text":"solve(prob::PDMPProblem, alg; kwargs)","category":"page"},{"location":"solver/#","page":"Solver Algorithms","title":"Solver Algorithms","text":"Solves the PDMP defined by prob using the algorithm alg.","category":"page"},{"location":"solver/#Simulation-methods-1","page":"Solver Algorithms","title":"Simulation methods","text":"","category":"section"},{"location":"solver/#","page":"Solver Algorithms","title":"Solver Algorithms","text":"We provide several methods for the simulation:","category":"page"},{"location":"solver/#","page":"Solver Algorithms","title":"Solver Algorithms","text":"a relatively recent trick, called CHV, explained in paper-2015 which allows to implement the True Jump Method without the need to use event detection schemes for the ODE integrator. These event detections can be quite numerically unstable as explained in paper-2015 and CHV provide a solution to this problem.\nrejection methods for which the user is asked to provide a bound on the total reaction rate. These last methods are the most \"exact\" but not the fastest if the reaction rate bound is not tight. In case the flow is known analytically, a method is also provided.","category":"page"},{"location":"solver/#","page":"Solver Algorithms","title":"Solver Algorithms","text":"These methods require solving stiff ODEs (for CHV) in an efficient manner. Sundials.jl and LSODA.jl are great, but other solvers can also be considered (see stiff ode solvers and also the solvers from DifferentialEquations.jl). Hence, the current package allows the use of all solvers in DifferentialEquations.jl thereby giving access to a wide range of solvers. In particular, we can test different solvers to see how precise they are. Here is an example from examples/pdmpStiff.jl for which an analytical expression is available which allows computation of the errors","category":"page"},{"location":"solver/#","page":"Solver Algorithms","title":"Solver Algorithms","text":"Comparison of solvers\n--> norm difference = 0.00019114008823351014  - solver = cvode\n--> norm difference = 0.00014770067837588385  - solver = lsoda\n--> norm difference = 0.00018404736432131585  - solver = CVODEBDF\n--> norm difference = 6.939603217404056e-5    - solver = CVODEAdams\n--> norm difference = 2.216652299580346e-5    - solver = tsit5\n--> norm difference = 2.2758951345736023e-6   - solver = rodas4P-noAutoDiff\n--> norm difference = 2.496987313804766e-6    - solver = rodas4P-AutoDiff\n--> norm difference = 0.0004373003700521849   - solver = RS23\n--> norm difference = 2.216652299580346e-5    - solver = AutoTsit5RS23","category":"page"},{"location":"solver/#","page":"Solver Algorithms","title":"Solver Algorithms","text":"note: ODE Solvers\nA lot of care have been taken to be sure that the algorithms do not allocate and hence are fast. This is based on an iterator interface of DifferentialEquations. If you chose save_positions = (false, false), the allocations should be independent from the requested jump number. However, the iterator solution is not yet available for LSODA in DifferentialEquations. Hence, you can pass ode = :lsoda to access an old version of the algorithm (which allocates), or any other solver like ode = Tsit5() to access the new solver.","category":"page"},{"location":"solver/#How-to-chose-an-algorithm?-1","page":"Solver Algorithms","title":"How to chose an algorithm?","text":"","category":"section"},{"location":"solver/#","page":"Solver Algorithms","title":"Solver Algorithms","text":"The choice of the method CHV vs Rejection only depends on how much you know about the system. ","category":"page"},{"location":"solver/#","page":"Solver Algorithms","title":"Solver Algorithms","text":"More precisely, if the total rate function does not vary much in between jumps, use the rejection method. For example, if the rate is R(x_c(t)) = 1+01cos(t),  then 1+01 will provide a tight bound to use for the rejection method and almost no (fictitious) jumps will be rejected. ","category":"page"},{"location":"solver/#","page":"Solver Algorithms","title":"Solver Algorithms","text":"In all other cases, one should try the CHV method where no a priori knowledge of the rate function is needed.","category":"page"},{"location":"solver/#","page":"Solver Algorithms","title":"Solver Algorithms","text":"warning: CHV Method\nA strong requirement for the CHV method is that the total rate (i.e. sum(rate)) must be positive. This can be easily achieved by adding a dummy Poisson process with very low intensity (see examples).","category":"page"},{"location":"solver/#Common-Solver-Options-1","page":"Solver Algorithms","title":"Common Solver Options","text":"","category":"section"},{"location":"solver/#","page":"Solver Algorithms","title":"Solver Algorithms","text":"To simulate a PDMP, one uses solve(prob::PDMPProblem, alg; kwargs). The field are as follows","category":"page"},{"location":"solver/#","page":"Solver Algorithms","title":"Solver Algorithms","text":"alg can be CHV(ode) (for the CHV algorithm), Rejection(ode) for the Rejection algorithm and RejectionExact() for the rejection algorithm in case the flow in between jumps is known analytically. In this latter case, prob.F is used for the specification of the Flow. The ODE solver ode can be any solver of DifferentialEquations.jl like Tsit5() for example or anyone of the list [:cvode, :lsoda, :adams, :bdf, :euler]. Indeed, the package implement an iterator interface which does not work yet with ode = LSODA(). In order to have access to the ODE solver LSODA(), one should use ode = :lsoda.\nn_jumps = 10: requires the solver to only compute the first 10 jumps.\nsave_position = (true, false): (output control) requires the solver to save the pre-jump but not the post-jump states xc, xd.\nverbose = true: requires the solver to print information concerning the simulation of the PDMP\nreltol: relative tolerance used in the ODE solver\nabstol: absolute tolerance used in the ODE solver\nind_save_c: which indices of xc should be saved\nind_save_d: which indices of xd should be saved\nsave_rate = true: requires the solver to save the total rate. Can be useful when estimating the rate bounds in order to use the Rejection algorithm as a second try.\nX_extended = zeros(Tc, 1 + 1): (advanced use) options used to provide the shape of the extended array in the CHV algorithm. Can be useful in order to use StaticArrays.jl for example.\nfinalizer = finalize_dummy: allows the user to pass a function finalizer(rate, xc, xd, p, t) which is called after each jump. Can be used to overload / add saving / plotting mechanisms.","category":"page"},{"location":"solver/#","page":"Solver Algorithms","title":"Solver Algorithms","text":"note: Solvers for the `DiffEqJump` wrapper\nWe provide a basic wrapper that should work for VariableJumps (the other types of jumps have not been thoroughly tested). You can use CHV for this type of problems. The Rejection solver is not functional yet.","category":"page"},{"location":"#PiecewiseDeterministicMarkovProcesses.jl-1","page":"Home","title":"PiecewiseDeterministicMarkovProcesses.jl","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"PiecewiseDeterministicMarkovProcesses.jl is a Julia package that allows simulation of Piecewise Deterministic Markov Processes (PDMP); these encompass hybrid systems and jump processes, comprised of continuous and discrete components, as well as processes with time-varying rates. The aim of the package is to provide methods for the simulation of these processes that are \"statistically exact\" up to the ODE integrator.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"If you find this package useful, please star the repo. If you use it in your work, please cite this code and send us an email so that we can cite your work here.","category":"page"},{"location":"#Definition-of-the-Jump-process-1","page":"Home","title":"Definition of the Jump process","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"We briefly recall facts about a simple class of PDMPs. They are described by a couple (x_c x_d) where x_c is solution of the differential equation fracdx_c(t)dt = F(x_c(t)x_d(t)pt) The second component x_d is a piecewise constant array with type Int and p are some parameters. The jumps occur at rates R(x_c(t)x_d(t)pt). At each jump, x_d or x_c can be affected.","category":"page"},{"location":"#Related-projects-1","page":"Home","title":"Related projects","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Gillespie.jl: a package for simulation of pure Jump processes, i.e. without the continuous part x_c.\nDiffEqJump.jl: similar to our setting with different sampling algorithm\nPDSampler.jl\nConstrainedPDMP.jl","category":"page"},{"location":"#Installation-1","page":"Home","title":"Installation","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"To install this package, run the command ","category":"page"},{"location":"#","page":"Home","title":"Home","text":"add PiecewiseDeterministicMarkovProcesses","category":"page"},{"location":"#References-1","page":"Home","title":"References","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"R. Veltz, A new twist for the simulation of hybrid systems using the true jump method, arXiv preprint, 2015.\nA. Drogoul and R. Veltz Hopf bifurcation in a nonlocal nonlinear transport equation stemming from stochastic neural dynamics, Chaos: An Interdisciplinary Journal of Nonlinear Science, 27(2), 2017\nAymard, Campillo, and Veltz, Mean-Field Limit of Interacting 2D Nonlinear Stochastic Spiking Neurons, arXiv preprint, 2019.","category":"page"}]
}
