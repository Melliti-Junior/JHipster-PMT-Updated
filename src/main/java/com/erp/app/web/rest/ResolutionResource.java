package com.erp.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.erp.app.domain.Resolution;

import com.erp.app.repository.ResolutionRepository;
import com.erp.app.repository.search.ResolutionSearchRepository;
import com.erp.app.web.rest.errors.BadRequestAlertException;
import com.erp.app.web.rest.util.HeaderUtil;
import com.erp.app.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Resolution.
 */
@RestController
@RequestMapping("/api")
public class ResolutionResource {

    private final Logger log = LoggerFactory.getLogger(ResolutionResource.class);

    private static final String ENTITY_NAME = "resolution";

    private final ResolutionRepository resolutionRepository;

    private final ResolutionSearchRepository resolutionSearchRepository;

    public ResolutionResource(ResolutionRepository resolutionRepository, ResolutionSearchRepository resolutionSearchRepository) {
        this.resolutionRepository = resolutionRepository;
        this.resolutionSearchRepository = resolutionSearchRepository;
    }

    /**
     * POST  /resolutions : Create a new resolution.
     *
     * @param resolution the resolution to create
     * @return the ResponseEntity with status 201 (Created) and with body the new resolution, or with status 400 (Bad Request) if the resolution has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/resolutions")
    @Timed
    public ResponseEntity<Resolution> createResolution(@Valid @RequestBody Resolution resolution) throws URISyntaxException {
        log.debug("REST request to save Resolution : {}", resolution);
        if (resolution.getId() != null) {
            throw new BadRequestAlertException("A new resolution cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Resolution result = resolutionRepository.save(resolution);
        resolutionSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/resolutions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /resolutions : Updates an existing resolution.
     *
     * @param resolution the resolution to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated resolution,
     * or with status 400 (Bad Request) if the resolution is not valid,
     * or with status 500 (Internal Server Error) if the resolution couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/resolutions")
    @Timed
    public ResponseEntity<Resolution> updateResolution(@Valid @RequestBody Resolution resolution) throws URISyntaxException {
        log.debug("REST request to update Resolution : {}", resolution);
        if (resolution.getId() == null) {
            return createResolution(resolution);
        }
        Resolution result = resolutionRepository.save(resolution);
        resolutionSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, resolution.getId().toString()))
            .body(result);
    }

    /**
     * GET  /resolutions : get all the resolutions.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of resolutions in body
     */
    @GetMapping("/resolutions")
    @Timed
    public ResponseEntity<List<Resolution>> getAllResolutions(Pageable pageable) {
        log.debug("REST request to get a page of Resolutions");
        Page<Resolution> page = resolutionRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/resolutions");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /resolutions/:id : get the "id" resolution.
     *
     * @param id the id of the resolution to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the resolution, or with status 404 (Not Found)
     */
    @GetMapping("/resolutions/{id}")
    @Timed
    public ResponseEntity<Resolution> getResolution(@PathVariable String id) {
        log.debug("REST request to get Resolution : {}", id);
        Resolution resolution = resolutionRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(resolution));
    }

    /**
     * DELETE  /resolutions/:id : delete the "id" resolution.
     *
     * @param id the id of the resolution to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/resolutions/{id}")
    @Timed
    public ResponseEntity<Void> deleteResolution(@PathVariable String id) {
        log.debug("REST request to delete Resolution : {}", id);
        resolutionRepository.delete(id);
        resolutionSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/resolutions?query=:query : search for the resolution corresponding
     * to the query.
     *
     * @param query the query of the resolution search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/resolutions")
    @Timed
    public ResponseEntity<List<Resolution>> searchResolutions(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Resolutions for query {}", query);
        Page<Resolution> page = resolutionSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/resolutions");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
