package com.erp.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.erp.app.domain.Transition;

import com.erp.app.repository.TransitionRepository;
import com.erp.app.repository.search.TransitionSearchRepository;
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
 * REST controller for managing Transition.
 */
@RestController
@RequestMapping("/api")
public class TransitionResource {

    private final Logger log = LoggerFactory.getLogger(TransitionResource.class);

    private static final String ENTITY_NAME = "transition";

    private final TransitionRepository transitionRepository;

    private final TransitionSearchRepository transitionSearchRepository;

    public TransitionResource(TransitionRepository transitionRepository, TransitionSearchRepository transitionSearchRepository) {
        this.transitionRepository = transitionRepository;
        this.transitionSearchRepository = transitionSearchRepository;
    }

    /**
     * POST  /transitions : Create a new transition.
     *
     * @param transition the transition to create
     * @return the ResponseEntity with status 201 (Created) and with body the new transition, or with status 400 (Bad Request) if the transition has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/transitions")
    @Timed
    public ResponseEntity<Transition> createTransition(@Valid @RequestBody Transition transition) throws URISyntaxException {
        log.debug("REST request to save Transition : {}", transition);
        if (transition.getId() != null) {
            throw new BadRequestAlertException("A new transition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Transition result = transitionRepository.save(transition);
        transitionSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/transitions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /transitions : Updates an existing transition.
     *
     * @param transition the transition to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated transition,
     * or with status 400 (Bad Request) if the transition is not valid,
     * or with status 500 (Internal Server Error) if the transition couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/transitions")
    @Timed
    public ResponseEntity<Transition> updateTransition(@Valid @RequestBody Transition transition) throws URISyntaxException {
        log.debug("REST request to update Transition : {}", transition);
        if (transition.getId() == null) {
            return createTransition(transition);
        }
        Transition result = transitionRepository.save(transition);
        transitionSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, transition.getId().toString()))
            .body(result);
    }

    /**
     * GET  /transitions : get all the transitions.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of transitions in body
     */
    @GetMapping("/transitions")
    @Timed
    public ResponseEntity<List<Transition>> getAllTransitions(Pageable pageable) {
        log.debug("REST request to get a page of Transitions");
        Page<Transition> page = transitionRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/transitions");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /transitions/:id : get the "id" transition.
     *
     * @param id the id of the transition to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the transition, or with status 404 (Not Found)
     */
    @GetMapping("/transitions/{id}")
    @Timed
    public ResponseEntity<Transition> getTransition(@PathVariable String id) {
        log.debug("REST request to get Transition : {}", id);
        Transition transition = transitionRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(transition));
    }

    /**
     * DELETE  /transitions/:id : delete the "id" transition.
     *
     * @param id the id of the transition to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/transitions/{id}")
    @Timed
    public ResponseEntity<Void> deleteTransition(@PathVariable String id) {
        log.debug("REST request to delete Transition : {}", id);
        transitionRepository.delete(id);
        transitionSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/transitions?query=:query : search for the transition corresponding
     * to the query.
     *
     * @param query the query of the transition search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/transitions")
    @Timed
    public ResponseEntity<List<Transition>> searchTransitions(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Transitions for query {}", query);
        Page<Transition> page = transitionSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/transitions");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
