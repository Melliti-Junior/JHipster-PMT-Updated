package com.erp.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.erp.app.domain.Sprint;

import com.erp.app.repository.SprintRepository;
import com.erp.app.repository.search.SprintSearchRepository;
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
 * REST controller for managing Sprint.
 */
@RestController
@RequestMapping("/api")
public class SprintResource {

    private final Logger log = LoggerFactory.getLogger(SprintResource.class);

    private static final String ENTITY_NAME = "sprint";

    private final SprintRepository sprintRepository;

    private final SprintSearchRepository sprintSearchRepository;

    public SprintResource(SprintRepository sprintRepository, SprintSearchRepository sprintSearchRepository) {
        this.sprintRepository = sprintRepository;
        this.sprintSearchRepository = sprintSearchRepository;
    }

    /**
     * POST  /sprints : Create a new sprint.
     *
     * @param sprint the sprint to create
     * @return the ResponseEntity with status 201 (Created) and with body the new sprint, or with status 400 (Bad Request) if the sprint has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/sprints")
    @Timed
    public ResponseEntity<Sprint> createSprint(@Valid @RequestBody Sprint sprint) throws URISyntaxException {
        log.debug("REST request to save Sprint : {}", sprint);
        if (sprint.getId() != null) {
            throw new BadRequestAlertException("A new sprint cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Sprint result = sprintRepository.save(sprint);
        sprintSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/sprints/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /sprints : Updates an existing sprint.
     *
     * @param sprint the sprint to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated sprint,
     * or with status 400 (Bad Request) if the sprint is not valid,
     * or with status 500 (Internal Server Error) if the sprint couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/sprints")
    @Timed
    public ResponseEntity<Sprint> updateSprint(@Valid @RequestBody Sprint sprint) throws URISyntaxException {
        log.debug("REST request to update Sprint : {}", sprint);
        if (sprint.getId() == null) {
            return createSprint(sprint);
        }
        Sprint result = sprintRepository.save(sprint);
        sprintSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, sprint.getId().toString()))
            .body(result);
    }

    /**
     * GET  /sprints : get all the sprints.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of sprints in body
     */
    @GetMapping("/sprints")
    @Timed
    public ResponseEntity<List<Sprint>> getAllSprints(Pageable pageable) {
        log.debug("REST request to get a page of Sprints");
        Page<Sprint> page = sprintRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/sprints");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /sprints/:id : get the "id" sprint.
     *
     * @param id the id of the sprint to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the sprint, or with status 404 (Not Found)
     */
    @GetMapping("/sprints/{id}")
    @Timed
    public ResponseEntity<Sprint> getSprint(@PathVariable String id) {
        log.debug("REST request to get Sprint : {}", id);
        Sprint sprint = sprintRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(sprint));
    }

    /**
     * DELETE  /sprints/:id : delete the "id" sprint.
     *
     * @param id the id of the sprint to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/sprints/{id}")
    @Timed
    public ResponseEntity<Void> deleteSprint(@PathVariable String id) {
        log.debug("REST request to delete Sprint : {}", id);
        sprintRepository.delete(id);
        sprintSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/sprints?query=:query : search for the sprint corresponding
     * to the query.
     *
     * @param query the query of the sprint search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/sprints")
    @Timed
    public ResponseEntity<List<Sprint>> searchSprints(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Sprints for query {}", query);
        Page<Sprint> page = sprintSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/sprints");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
