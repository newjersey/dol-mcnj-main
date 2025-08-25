"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerFactory = void 0;
const tslib_1 = require("tslib");
const express_1 = require("express");
const Selector_1 = require("../domain/training/Selector");
const CareerOneStopClient_1 = require("../careeronestop/CareerOneStopClient");
const routerFactory = ({ allTrainings, searchTrainings, findTrainingsBy, getInDemandOccupations, getOccupationDetail, getAllCertificates, getOccupationDetailByCIP, }) => {
    const router = (0, express_1.Router)();
    router.get("/ce/getallcredentials/:skip/:take/:sort/:cancel", (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        getAllCertificates(req.params.skip, req.params.take, req.params.sort, req.params.cancel)
            .then((certificates) => {
            res.status(200).json(certificates);
        })
            .catch((e) => res.status(500).send(e));
    }));
    router.get("/trainings/all", (req, res) => {
        allTrainings()
            .then((trainings) => {
            res.status(200).json(trainings);
        })
            .catch((e) => res.status(500).send(e));
    });
    router.get("/trainings/search", (req, res) => {
        let page = parseInt(req.query.page);
        if (isNaN(page) || page < 1) {
            page = 1;
        }
        let limit = parseInt(req.query.limit);
        if (isNaN(limit) || limit < 1) {
            limit = 10;
        }
        searchTrainings({
            searchQuery: req.query.query,
            page: page,
            limit: limit,
            sort: req.query.sort,
            cip_code: req.query.cip_code,
            format: req.query.format ? req.query.format.split(",") : undefined,
            complete_in: req.query.complete_in ? req.query.complete_in.split(",").map(Number) : undefined,
            county: req.query.county,
            in_demand: req.query.in_demand === "true",
            languages: req.query.languages ? req.query.languages.split(",") : undefined,
            max_cost: parseInt(req.query.max_cost),
            miles: parseInt(req.query.miles),
            services: req.query.services ? req.query.services.split(",") : undefined,
            soc_code: req.query.soc_code,
            zipcode: req.query.zipcode,
        })
            .then((trainings) => {
            res.status(200).json(trainings);
        })
            .catch((e) => res.status(500).send(e));
    });
    router.get("/trainings/:id", (req, res) => {
        findTrainingsBy(Selector_1.Selector.ID, [req.params.id])
            .then((trainings) => {
            if (trainings.length === 0) {
                res.set("X-Robots-Tag", "noindex");
                return res.status(404).json({ error: "Not found" });
            }
            return res.status(200).json(trainings[0]);
        })
            .catch((e) => {
            if ((e === null || e === void 0 ? void 0 : e.message) === "NOT_FOUND") {
                res.set("X-Robots-Tag", "noindex");
                return res.status(404).json({ error: "Not found" });
            }
            return res.status(500).json({ error: "Server error" });
        });
    });
    router.get("/occupations", (req, res) => {
        getInDemandOccupations()
            .then((occupations) => {
            res.status(200).json(occupations);
        })
            .catch((e) => res.status(500).send(e));
    });
    router.get("/occupations/:soc", (req, res) => {
        getOccupationDetail(req.params.soc)
            .then((occupationDetail) => {
            if (!occupationDetail) {
                res.status(404).send();
                throw new Error("NOT_FOUND");
            }
            res.status(200).json(occupationDetail);
        })
            .catch(() => res.status(500).send());
    });
    router.get("/jobcount/:term", (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const sanitizedTerm = encodeURIComponent(req.params.term || "");
        const countData = yield (0, CareerOneStopClient_1.CareerOneStopClient)(process.env.CAREER_ONESTOP_BASEURL, process.env.CAREER_ONESTOP_USERID, process.env.CAREER_ONESTOP_AUTH_TOKEN)(sanitizedTerm);
        res.status(200).json({ count: countData || 0 });
    }));
    router.get("/occupations/cip/:cip", (req, res) => {
        getOccupationDetailByCIP(req.params.cip)
            .then((occupationDetails) => {
            res.status(200).json(occupationDetails);
        })
            .catch(() => res.status(500).send());
    });
    return router;
};
exports.routerFactory = routerFactory;
